import { useEffect, useRef, useState } from "react";
import { initialCollabNotes } from "../cases/001-Scandbury/collabNotes.js";
import { useCommunications } from "../communications/useCommunications.js";
import "../styles/organizer.css";


import { caseMap, mapRegions, mapLocations } from "../cases/001-Scandbury/mapData.js";

/* =========================================================
   COLLAB NOTES DATA
========================================================= */

const notebookPages = initialCollabNotes;


export default function OrganizerScreen({ onTravel, onClose, isVisible = true, canWorldTravel = false, currentLocationId, currentSceneId, onUnreadChange }) {

  /* =========================================================
     COLLAB NOTES STATE
  ========================================================= */

  const swipeStart = useRef(null);

  const onCoverPointerDown = (event, side) => {
    if (!isVisible || !event.isPrimary) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    swipeStart.current = { side, x: event.clientX, y: event.clientY, id: event.pointerId };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onCoverPointerUp = (event) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start || start.id !== event.pointerId || !isVisible) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    // Require a deliberate inward horizontal swipe, not a tap or a vertical scroll.
    if (Math.abs(dx) >= 65 && Math.abs(dx) > Math.abs(dy) * 1.35 &&
        ((start.side === "left" && dx > 0) || (start.side === "right" && dx < 0))) {
      onClose?.();
    }
  };

  const [currentPage, setCurrentPage] = useState(0);

  const page = notebookPages[currentPage];

  const goPreviousPage = () => {
    setCurrentPage((current) =>
      Math.max(0, current - 1)
    );
  };

  const goNextPage = () => {
    setCurrentPage((current) =>
      Math.min(
        notebookPages.length - 1,
        current + 1
      )
    );
  };


  /* =========================================================
     PEAR STATE
  ========================================================= */

  const [pearApp, setPearApp] = useState("home");
  const [arrivalMenuOpen, setArrivalMenuOpen] = useState(false);
  const communications = useCommunications({
    locationId: currentLocationId,
    messagesVisible: isVisible && pearApp === "messages",
    knownFacts: [],
  });
  const messageHistoryRef = useRef(null);
  const [followLatestMessages, setFollowLatestMessages] = useState(true);
  const [newMessageActivity, setNewMessageActivity] = useState(false);

  const scrollMessagesToLatest = (behavior = "smooth") => {
    const node = messageHistoryRef.current;
    if (!node) return;
    node.scrollTo({ top: node.scrollHeight, behavior });
    setNewMessageActivity(false);
  };

  const onMessageHistoryScroll = (event) => {
    const node = event.currentTarget;
    const distanceFromBottom = node.scrollHeight - node.scrollTop - node.clientHeight;
    const atLatest = distanceFromBottom < 24;
    setFollowLatestMessages(atLatest);
    if (atLatest) setNewMessageActivity(false);
  };

  const selectedMessages = communications.threads[communications.selectedContactId] ?? [];
  const selectedLastMessage = selectedMessages[selectedMessages.length - 1];
  useEffect(() => {
    if (pearApp !== "messages") return;
    if (followLatestMessages) {
      requestAnimationFrame(() => scrollMessagesToLatest("smooth"));
    } else {
      setNewMessageActivity(true);
    }
  }, [
    pearApp,
    communications.selectedContactId,
    selectedMessages.length,
    selectedLastMessage?.readAt,
    communications.typing[communications.selectedContactId],
  ]);

  useEffect(() => {
    if (pearApp !== "messages") return;
    setFollowLatestMessages(true);
    requestAnimationFrame(() => scrollMessagesToLatest("auto"));
  }, [communications.selectedContactId, pearApp]);

  // Bubble unread totals up to the field HUD without making the HUD understand Pear internals.
  useEffect(() => {
    onUnreadChange?.(communications.totalUnread);
  }, [communications.totalUnread, onUnreadChange]);

  useEffect(() => {
    if (isVisible && page?.amaraNote) communications.markNotesRead();
  }, [page?.id, isVisible]);

  const [mapLevel, setMapLevel] = useState("regional");
  const [mapDebug] = useState(false); // Turn on temporarily only while calibrating authored regional boundaries.
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [mapNotice, setMapNotice] = useState("");

  const selectedRegion = mapRegions[selectedRegionId];
  const selectedLocation = mapLocations.find(
    (location) => location.id === selectedLocationId
  );

  const currentMapLocation = mapLocations.find((location) => location.id === currentLocationId);
  const currentArrivalPoint = currentMapLocation?.arrivalPoints?.find((point) => point.sceneId === currentSceneId);
  const playerMapPosition = mapLevel === "regional"
    ? currentMapLocation?.positions?.regional
    : mapLevel === "neighbourhood"
      ? (currentMapLocation?.regionId === selectedRegionId ? currentMapLocation?.positions?.neighbourhood : null)
      : (currentMapLocation?.id === selectedLocationId ? (currentArrivalPoint?.position || currentMapLocation?.positions?.property) : null);

  const mapImage = mapLevel === "regional"
    ? caseMap.regionalImage
    : mapLevel === "neighbourhood"
      ? selectedRegion?.image
      : selectedLocation?.propertyImage;

  const mapLabel = mapLevel === "regional"
    ? caseMap.regionalLabel
    : mapLevel === "neighbourhood"
      ? `${selectedRegion?.name ?? "Neighbourhood"} — Neighbourhood View`
      : `${selectedLocation?.name ?? "Location"} — Property View`;

  const openRegion = (regionId) => {
    if (!mapRegions[regionId]) return;
    setSelectedRegionId(regionId);
    setSelectedLocationId(null);
    setMapNotice("");
    setMapLevel("neighbourhood");
  };

  const openLocation = (location) => {
    if (!location.discovered) return;
    if (!location.propertyImage) {
      setMapNotice(`${location.name} is a reference location, not a travel destination.`);
      return;
    }
    setSelectedRegionId(location.regionId);
    setSelectedLocationId(location.id);
    setMapNotice(`${location.name} selected.`);
    setMapLevel("property");
  };

  const goMapBack = () => {
    setMapNotice("");
    if (mapLevel === "property") {
      setSelectedLocationId(null);
      setMapLevel("neighbourhood");
    } else if (mapLevel === "neighbourhood") {
      setSelectedRegionId(null);
      setMapLevel("regional");
    }
  };

  const handleMapMarker = (location) => {
    if (mapLevel === "regional") {
      openRegion(location.regionId);
    } else if (mapLevel === "neighbourhood") {
      openLocation(location);
    } else if (mapLevel === "property" && location.id === selectedLocationId) {
      setMapNotice(`${location.name} selected.`);
    }
  };

  const availableArrivalPoints = selectedLocation?.arrivalPoints?.filter(
    (point) => point.discovered && point.travelAccessible
  ) ?? [];

  const handleTravelPoint = () => {
    if (!canWorldTravel || !selectedLocation || selectedLocation.id === currentLocationId || availableArrivalPoints.length === 0) return;
    if (availableArrivalPoints.length === 1) {
      onTravel?.(selectedLocation.id, availableArrivalPoints[0]);
      return;
    }
    setArrivalMenuOpen((current) => !current);
  };

  const chooseArrivalPoint = (point) => {
    if (!canWorldTravel || selectedLocation?.id === currentLocationId || !point.travelAccessible) return;
    onTravel?.(selectedLocation.id, point);
  };


  const openMessages = () => {
    setPearApp("messages");
    communications.selectContact(communications.selectedContactId);
  };


  return (
    <main className={`organizer-screen${isVisible ? "" : " organizer-screen--stowed"}`}>

      <section className="organizer">

        {/* =====================================================
            PHYSICAL ORGANIZER
        ====================================================== */}

        <img
          src="/assets/organizer/organizer-production.webp"
          alt="Open Mensah Investigations field organizer"
          className="organizer-base"
        />


        {/* =====================================================
            COLLAB NOTES
        ====================================================== */}

        <div className="notes-live-screen">

          <div className="notes-meta">

            <span>
              Added by: {page.username}
            </span>

            <span>
              {currentPage + 1} / {notebookPages.length}
            </span>

          </div>


          <div className="notes-page">

            <div className="notes-sharing">

              <small>
                Created by: {page.createdBy}
              </small>

              <small>
                Shared with: {page.sharedWith}
              </small>

            </div>


            <p className="notes-time">
              {page.time}
            </p>


            <h2>
              {page.title}
            </h2>


            <p className="notes-subtitle">
              {page.subtitle}
            </p>


            {page.sketch && (

              <div className="notes-sketch">

                <div className="hatch-sketch">
                  <div className="hatch-inner" />
                </div>

                <span>
                  strange hatch behind shelving
                </span>

              </div>

            )}


            {page.content.map((paragraph, index) => (

              <p key={index}>
                {paragraph}
              </p>

            ))}


            {page.amaraNote && (

              <p className="amara-note">
                — Amara
              </p>

            )}

          </div>


          <div className="notes-controls">

            <button
              type="button"
              onClick={goPreviousPage}
              disabled={currentPage === 0}
              aria-label="Previous notebook page"
            >
              ‹
            </button>


            <button
              type="button"
              aria-label="Notebook index"
            >
              ☰
            </button>


            <button
              type="button"
              aria-label="Search notebook"
            >
              ⌕
            </button>


            <button
              type="button"
              aria-label="Upload notes"
            >
              ↥
            </button>


            <button
              type="button"
              onClick={goNextPage}
              disabled={
                currentPage ===
                notebookPages.length - 1
              }
              aria-label="Next notebook page"
            >
              ›
            </button>

          </div>

        </div>


        {/* =====================================================
            PEAR
        ====================================================== */}

        <div className="pear-live-screen">


          {/* ===================================================
              PEAR HOME
          =================================================== */}

          {pearApp === "home" && (
            <>
              <div className="pear-contact">
                <div>
                  <strong>PEAR INVESTIGATIVE TABLET</strong>
                  <small>Collab*Notes linked</small>
                  <small className="assisted-mode">✦ Assisted Messaging <span aria-label="Locked">🔒</span></small>
                </div>
                <span className="message-indicator">✉{communications.unreadMessages > 0 && <b>{communications.unreadMessages}</b>}</span>
              </div>

              <div className="pear-apps">
                <button className="pear-app" type="button" onClick={() => setPearApp("map")}>
                  <span>⌖</span><strong>MAP</strong><small>1 known location</small>
                </button>
                <button className="pear-app" type="button" onClick={openMessages}>
                  <span>▤</span><strong>MESSAGES</strong>
                  <small>{communications.unreadMessages ? `${communications.unreadMessages} new` : "No new messages"}</small>
                </button>
                <button className="pear-app" type="button" onClick={() => setPearApp("calls")}>
                  <span>☎</span><strong>CALLS</strong><small>Auto-record enabled</small>
                </button>
                <button className="pear-app" type="button" onClick={() => setPearApp("files")}>
                  <span>▰</span><strong>FILES</strong><small>0 new</small>
                </button>
              </div>
            </>
          )}

          {/* ===================================================
              MESSAGES
          =================================================== */}

          {pearApp === "messages" && (
            <div className="pear-app-screen">
              <div className="pear-app-header">
                <button type="button" onClick={() => setPearApp("home")} aria-label="Back to Pear home">‹</button>
                <strong>Messages</strong>
                <span className="pear-mode-lock">✦ Assisted 🔒</span>
              </div>

              <div className="message-inbox-list" aria-label="Pear conversations">
                {Object.values(communications.contacts).map((contact) => (
                  <button
                    type="button"
                    key={contact.id}
                    className={`message-inbox-row ${communications.selectedContactId === contact.id ? "active" : ""}`}
                    onClick={() => communications.selectContact(contact.id)}
                  >
                    <span className="message-inbox-avatar">{contact.id === "amara" ? "A" : "K"}</span>
                    <span className="message-inbox-identity">
                      <strong>{contact.handle}</strong>
                      <small>{contact.name}</small>
                      <em className={contact.tone}>● {contact.status}</em>
                    </span>
                    {communications.unreadByContact[contact.id] > 0 && <b className="message-inbox-unread">{communications.unreadByContact[contact.id]}</b>}
                  </button>
                ))}
              </div>

              {(() => {
                const contact = communications.contacts[communications.selectedContactId];
                const messages = communications.threads[communications.selectedContactId];
                return (
                  <div className="message-thread">
                    <div className="message-thread-person">
                      <strong>{contact.handle} <span>· {contact.name}</span></strong>
                      <small className={contact.tone}>● {contact.status}</small>
                    </div>

                    <div className="message-history-wrap">
                    <div className="message-history" ref={messageHistoryRef} onScroll={onMessageHistoryScroll}>
                      {messages.length === 0 && <p className="message-empty">No messages yet.</p>}
                      {messages.map((message) => (
                        <div key={message.id} className={`message-bubble ${message.from === "player" ? "message-bubble--player" : "message-bubble--contact"}`}>
                          {message.text.map((line, index) => <p key={index}>{line}</p>)}
                          {message.from === "player" ? (
                            <small className="message-meta">Sent: {message.sentAt}{message.readAt ? `   ·   Read: ${message.readAt}` : ""}</small>
                          ) : (
                            <small className="message-meta">Received: {message.receivedAt}</small>
                          )}
                        </div>
                      ))}
                      {communications.typing[communications.selectedContactId] && (
                        <div className="message-typing" aria-label={`${contact.name} is typing`}>
                          <i></i><i></i><i></i>
                        </div>
                      )}
                    </div>
                    {newMessageActivity && !followLatestMessages && (
                      <button type="button" className="message-latest" onClick={() => { setFollowLatestMessages(true); scrollMessagesToLatest(); }}>
                        ↓ Latest activity
                      </button>
                    )}
                    </div>

                    <div className="assisted-compose">
                      {communications.notice && <div className="pear-message-notice">{communications.notice}</div>}
                      <div className="assisted-compose__label"><span>✦ Pear Assisted Messaging</span><span>🔒</span></div>
                      <small>Suggested from current case context and synchronized Collab*Notes.</small>
                      <div className="assisted-suggestions">
                        {communications.suggestions.map((suggestion) => (
                          <button type="button" key={suggestion.id} disabled={communications.pendingContacts.includes(communications.selectedContactId)} onClick={() => communications.sendSuggestion(suggestion)}>
                            {suggestion.text}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ===================================================
              CALLS
          =================================================== */}
          {pearApp === "calls" && (
            <div className="pear-app-screen">
              <div className="pear-app-header">
                <button type="button" onClick={() => setPearApp("home")} aria-label="Back to Pear home">‹</button>
                <strong>Calls</strong>
              </div>
              <div className="pear-system-card">
                <strong>● Automatic Case Recording</strong>
                <p>Investigative calls are retained in Pear call history for later review.</p>
              </div>
              <button className="pear-call-row" type="button"><span>AMARA OKOYE<small>Available</small></span><b>☎</b></button>
              <button className="pear-call-row" type="button"><span>DR. K. MENSAH<small>Busy</small></span><b>☎</b></button>
            </div>
          )}

          {pearApp === "files" && (
            <div className="pear-app-screen">
              <div className="pear-app-header"><button type="button" onClick={() => setPearApp("home")}>‹</button><strong>Files</strong></div>
              <div className="pear-system-card"><strong>No new files</strong><p>Case recordings and received documents will appear here.</p></div>
            </div>
          )}

          {/* ===================================================
              MAP
          =================================================== */}

          {pearApp === "map" && (

            <div className="pear-app-screen pear-map-screen">

              <div className="pear-app-header">

                <button
                  type="button"
                  onClick={() =>
                    setPearApp("home")
                  }
                  aria-label="Back to Pear home"
                >
                  ‹
                </button>

                <strong>
                  Map
                </strong>

              </div>


              <div className="case-map">

                <img
                  src={mapImage}
                  alt={mapLabel}
                  className="case-map-image"
                />

                {/* Invisible geographic regions; labels remain separate above the polygons. */}
                {mapLevel === "regional" && (
                  <svg
                    className={`map-regions${mapDebug ? " map-regions-debug" : ""}`}
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    aria-label="Neighbourhood areas"
                  >
                    {Object.values(mapRegions).map((region) => (
                      <polygon
                        key={region.id}
                        points={region.polygon.map(([x, y]) => `${x},${y}`).join(" ")}
                        role="button"
                        tabIndex={0}
                        aria-label={`Explore ${region.name} neighbourhood`}
                        onClick={() => openRegion(region.id)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            openRegion(region.id);
                          }
                        }}
                      />
                    ))}
                  </svg>
                )}

                {mapLevel !== "property" && mapLocations
                  .filter((location) => {
                    if (!location.discovered) return false;
                    if (mapLevel === "neighbourhood") {
                      return location.regionId === selectedRegionId &&
                        Boolean(location.positions?.neighbourhood);
                    }
                    return Boolean(location.positions?.regional);
                  })
                  .map((location) => {
                    const position = location.positions[mapLevel];
                    return (
                      <button
                        key={location.id}
                        type="button"
                        className={`map-marker${mapLevel === "regional" ? " map-marker-regional" : ""} map-marker--label-below${!location.propertyImage ? " map-marker-reference" : ""}`}
                        style={{ left: `${position.x}%`, top: `${position.y}%` }}
                        onClick={() => handleMapMarker(location)}
                        aria-label={mapLevel === "regional"
                          ? `Explore ${location.subtitle} neighbourhood: ${location.name}`
                          : location.propertyImage
                            ? `View ${location.name} property`
                            : `${location.name}: reference only`}
                        title={`View ${location.name}`}
                      >
                        <span className="map-marker-x">×</span>
                        <span className="map-marker-label">
                          <strong>{location.name}</strong>
                          <small>{location.subtitle}</small>
                        </span>
                      </button>
                    );
                  })}

                {mapLevel === "property" && selectedLocation && (
                  <>
                    {(selectedLocation.arrivalPoints ?? [])
                      .filter((point) => point.discovered && point.position)
                      .map((point) => {
                        const actionable = canWorldTravel && point.travelAccessible && selectedLocation.id !== currentLocationId;
                        if (!actionable) {
                          return (
                            <div
                              key={point.id}
                              className="map-property-reference"
                              style={{ left: `${point.position.x}%`, top: `${point.position.y}%` }}
                              aria-label={`${point.label} — not currently available for travel`}
                            >
                              <span className="map-marker-x">×</span>
                              <span>{point.label}</span>
                            </div>
                          );
                        }
                        return (
                          <button
                            key={point.id}
                            type="button"
                            className="map-property-interaction"
                            style={{ left: `${point.position.x}%`, top: `${point.position.y}%` }}
                            onClick={() => chooseArrivalPoint(point)}
                            aria-label={`Travel to ${selectedLocation.name}, ${point.label}`}
                            title={`Travel to ${point.label}`}
                          >
                            <span className="map-property-interaction__pulse" aria-hidden="true" />
                            <span className="map-property-interaction__dot" aria-hidden="true" />
                            <span className="map-property-interaction__label">{point.label}</span>
                          </button>
                        );
                      })}
                  </>
                )}

                {playerMapPosition && (
                  <div
                    className="map-player-position"
                    style={{ left: `${playerMapPosition.x}%`, top: `${playerMapPosition.y}%` }}
                    aria-label="You are here"
                    title="You are here"
                  >
                    <span className="map-player-position__pulse" aria-hidden="true" />
                    <span className="map-player-position__dot" aria-hidden="true" />
                    <span className="map-player-position__label">You are here</span>
                  </div>
                )}

                <div className="map-compass" aria-label="North is up">
                  <span>N</span>
                  <span>↑</span>
                </div>

                {(
                  <div className="map-zoom-controls">
                    {mapLevel !== "property" && <button type="button" aria-label="Zoom in" title="Zoom in" onClick={() => {
                      if (mapLevel === "regional") openRegion(selectedRegionId || currentMapLocation?.regionId || Object.keys(mapRegions)[0]);
                      else { const destination = mapLocations.find((location) => location.discovered && location.regionId === selectedRegionId && location.propertyImage); if (destination) openLocation(destination); }
                    }}>+</button>}
                    {mapLevel !== "regional" &&
                    <button
                      type="button"
                      onClick={goMapBack}
                      aria-label={mapLevel === "property" ? "Zoom out to neighbourhood" : "Zoom out to regional map"}
                      title="Zoom out"
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <circle cx="10.8" cy="10.8" r="6.8" />
                        <path d="M16 16l5 5M7.8 10.8h6" />
                      </svg>
                    </button>
                    }
                  </div>
                )}
              </div>

              <small className="map-view-label">{mapLabel}</small>
              {mapNotice && <small className="map-notice" role="status">{mapNotice}</small>}

            </div>

          )}


          {/* ===================================================
              CALLS
          =================================================== */}

          {pearApp === "calls" && (

            <div className="pear-app-screen">

              <div className="pear-app-header">

                <button
                  type="button"
                  onClick={() =>
                    setPearApp("home")
                  }
                  aria-label="Back to Pear home"
                >
                  ‹
                </button>

                <strong>
                  Calls
                </strong>

              </div>

              <p>
                Calls coming next.
              </p>

            </div>

          )}


          {/* ===================================================
              FILES
          =================================================== */}

          {pearApp === "files" && (

            <div className="pear-app-screen">

              <div className="pear-app-header">

                <button
                  type="button"
                  onClick={() =>
                    setPearApp("home")
                  }
                  aria-label="Back to Pear home"
                >
                  ‹
                </button>

                <strong>
                  Files
                </strong>

              </div>

              <p>
                No files available yet.
              </p>

            </div>

          )}

        </div>


        {/* =====================================================
            INVISIBLE INTERACTION HOTSPOTS
        ====================================================== */}

        <button
          className="pear-menu-hotspot"
          type="button"
          aria-label="Open Pear system menu"
        />

        <button
          className="document-pocket-hotspot"
          type="button"
          aria-label="Open document pocket"
        />

        <button
          className="photo-pocket-hotspot"
          type="button"
          aria-label="Open photo pocket"
        />

        <button
          className="small-item-pocket-hotspot"
          type="button"
          aria-label="Open small-item pocket"
        />

        {/* Only the outer leather margins receive swipe gestures. */}
        <div className="organizer-swipe-zone organizer-swipe-zone--left"
          aria-hidden="true"
          onPointerDown={(event) => onCoverPointerDown(event, "left")}
          onPointerUp={onCoverPointerUp}
          onPointerCancel={() => { swipeStart.current = null; }}
          onLostPointerCapture={() => { swipeStart.current = null; }}
        />
        <div className="organizer-swipe-zone organizer-swipe-zone--right"
          aria-hidden="true"
          onPointerDown={(event) => onCoverPointerDown(event, "right")}
          onPointerUp={onCoverPointerUp}
          onPointerCancel={() => { swipeStart.current = null; }}
          onLostPointerCapture={() => { swipeStart.current = null; }}
        />
        <button className="organizer-close-tab" type="button"
          onClick={onClose} aria-label="Close organizer" title="Close organizer">
          <svg viewBox="0 0 32 32" width="22" height="22" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 7h9v18H5zM18 7h9v18h-9z" />
            <path d="m11 13 4 3-4 3m10-6-4 3 4 3" />
          </svg>
          <span>Close</span>
        </button>

      </section>

    </main>
  );
}