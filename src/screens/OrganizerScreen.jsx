import { useState } from "react";
import "../styles/organizer.css";


/* =========================================================
   CASE 001 MAP DATA
========================================================= */

// Case 001 proof of concept. Regions can later share neighbourhood maps.
const mapRegions = {
  "old-town": {
    id: "old-town",
    name: "Old Town",
    image: "/cases/001-scandbury/map/neighbourhood.webp"
  }
};

const mapLocations = [
  {
    id: "scandbury-mansion",
    regionId: "old-town",
    name: "Scandbury Mansion",
    subtitle: "Old Town",
    discovered: true,
    propertyImage: "/cases/001-scandbury/map/scandbury-mansion/property.webp",
    positions: {
      regional: { x: 42, y: 49 },
      neighbourhood: { x: 68, y: 25 },
      // Adjust this position after checking your actual property artwork.
      property: { x: 51, y: 43 }
    }
  },
  {
    id: "scandbury-pharmacy",
    regionId: "town-centre",
    name: "Scandbury Pharmacy",
    subtitle: "Rivalte",
    discovered: false,
    positions: { regional: { x: 61, y: 64 } }
  },
  {
    id: "st-bartholomews",
    regionId: "north-ridge",
    name: "St. Bartholomew's Cemetery",
    subtitle: "North Ridge",
    discovered: false,
    positions: { regional: { x: 28, y: 30 } }
  }
];

/* =========================================================
   COLLAB NOTES DATA
========================================================= */

const notebookPages = [
  {
    id: 1,
    createdBy: "Investigator",
    username: "Investigator",
    sharedWith: "sweetmara88 · mrinvestigator01",
    time: "Case 001",
    title: "Scandbury Mansion",
    subtitle: "Initial Investigation",
    content: [
      "Edward Scandbury, 67, disappeared from his estate four days ago.",
      "No signs of forced entry have been reported.",
      "No ransom demand has been received.",
      "Scandbury Mansion is currently the primary known location."
    ]
  },

  {
    id: 2,
    createdBy: "Investigator",
    username: "Investigator",
    sharedWith: "sweetmara88 · mrinvestigator01",
    time: "10:14 AM",
    title: "Mrs. Clarke",
    subtitle: "Housekeeper — Scandbury Mansion",
    content: [
      "Spoke with Mrs. Clarke in the main kitchen.",
      "Grey work uniform. Appeared tired and somewhat guarded.",
      "She says she last saw Mr. Scandbury Tuesday evening.",
      "Heard raised voices upstairs shortly before 8 PM.",
      "Saw an unfamiliar red car near the eastern drive.",
      "She became noticeably uncomfortable when asked about Thomas Scandbury."
    ]
  },

  {
    id: 3,
    createdBy: "Investigator",
    username: "Investigator",
    sharedWith: "sweetmara88 · mrinvestigator01",
    time: "12:07 PM",
    title: "Scandbury Pharmacy",
    subtitle: "Field Observation",
    content: [
      "Found a strange hatch door behind shelving near the rear storeroom.",
      "Cleaner says the hatch has been there for years but claims nobody uses it.",
      "No obvious handle on the visible side.",
      "Needs investigating further."
    ],
    sketch: true
  },

  {
    id: 4,
    createdBy: "Amara Okoye",
    username: "sweetmara88",
    sharedWith: "Investigator · mrinvestigator01",
    time: "2:32 PM",
    title: "Property Deed",
    subtitle: "Scandbury Pharmacy",
    content: [
      "I checked the property registry.",
      "The pharmacy property is registered to Scandbury Holdings Ltd.",
      "Transfer date: March 14, 2018.",
      "I added the deed details here so you have them with the rest of the case notes."
    ],
    amaraNote: true
  }
];


export default function OrganizerScreen({ onTravel }) {

  /* =========================================================
     COLLAB NOTES STATE
  ========================================================= */

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

  const [unreadMessages, setUnreadMessages] =
    useState(1);

  const [mapLevel, setMapLevel] = useState("regional");
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [mapNotice, setMapNotice] = useState("");

  const selectedRegion = mapRegions[selectedRegionId];
  const selectedLocation = mapLocations.find(
    (location) => location.id === selectedLocationId
  );

  const mapImage = mapLevel === "regional"
    ? "/cases/001-scandbury/map/regional.webp"
    : mapLevel === "neighbourhood"
      ? selectedRegion?.image
      : selectedLocation?.propertyImage;

  const mapLabel = mapLevel === "regional"
    ? "Regional View"
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
    if (!location.discovered || !location.propertyImage) return;
    setSelectedRegionId(location.regionId);
    setSelectedLocationId(location.id);
    setMapNotice("");
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
      if (typeof onTravel === "function") {
        onTravel(location.id);
      } else {
        setMapNotice("Travel scene not connected yet.");
      }
    }
  };


  const openMessages = () => {
    setPearApp("messages");
    setUnreadMessages(0);
  };


  return (
    <main className="organizer-screen">

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

                  <strong>
                    AMARA OKOYE
                  </strong>

                  <small>
                    Nassau, Bahamas
                  </small>

                  <small className="online">
                    ● Online / Available
                  </small>

                </div>


                <span className="message-indicator">

                  ✉

                  {unreadMessages > 0 && (
                    <b>{unreadMessages}</b>
                  )}

                </span>

              </div>


              <div className="pear-apps">

                <button
                  className="pear-app"
                  type="button"
                  onClick={() =>
                    setPearApp("map")
                  }
                >
                  <span>⌖</span>

                  <strong>
                    MAP
                  </strong>

                  <small>
                    1 known location
                  </small>
                </button>


                <button
                  className="pear-app"
                  type="button"
                  onClick={openMessages}
                >
                  <span>▤</span>

                  <strong>
                    MESSAGES
                  </strong>

                  <small>
                    {unreadMessages > 0
                      ? `${unreadMessages} new`
                      : "No new messages"}
                  </small>
                </button>


                <button
                  className="pear-app"
                  type="button"
                  onClick={() =>
                    setPearApp("calls")
                  }
                >
                  <span>☎</span>

                  <strong>
                    CALLS
                  </strong>

                  <small>
                    Mensah, Amara
                  </small>
                </button>


                <button
                  className="pear-app"
                  type="button"
                  onClick={() =>
                    setPearApp("files")
                  }
                >
                  <span>▰</span>

                  <strong>
                    FILES
                  </strong>

                  <small>
                    0 new
                  </small>
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
                  Messages
                </strong>

              </div>


              <div className="message-thread">

                <div className="message-thread-person">

                  <strong>
                    AMARA OKOYE
                  </strong>

                  <small>
                    Nassau, Bahamas
                  </small>

                  <small className="online">
                    ● Online / Available
                  </small>

                </div>


                <div className="message-bubble">

                  <small>
                    6:47 PM
                  </small>

                  <p>
                    You're set up.
                  </p>

                  <p>
                    I've sent the location of Scandbury Mansion
                    to your map.
                  </p>

                  <p>
                    Mensah wants you to begin there.
                  </p>

                  <p>
                    Message me if you need me to look into anything.
                  </p>

                </div>

              </div>

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

                {/* Prototype regional hotspot: click the known mansion area.
                    Replace with authored invisible region polygons as we add districts. */}
                {mapLevel === "regional" && (
                  <button
                    type="button"
                    className="map-region-hotspot"
                    style={{ left: "31%", top: "35%", width: "25%", height: "29%" }}
                    onClick={() => openRegion("old-town")}
                    aria-label="Explore Old Town neighbourhood"
                    title="Explore Old Town"
                  />
                )}

                {mapLocations
                  .filter((location) => {
                    if (!location.discovered) return false;
                    if (mapLevel === "neighbourhood") {
                      return location.regionId === selectedRegionId &&
                        Boolean(location.positions?.neighbourhood);
                    }
                    if (mapLevel === "property") {
                      return location.id === selectedLocationId &&
                        Boolean(location.positions?.property);
                    }
                    return Boolean(location.positions?.regional);
                  })
                  .map((location) => {
                    const position = location.positions[mapLevel];
                    return (
                      <button
                        key={location.id}
                        type="button"
                        className="map-marker"
                        style={{ left: `${position.x}%`, top: `${position.y}%` }}
                        onClick={() => handleMapMarker(location)}
                        aria-label={mapLevel === "property"
                          ? `Go to ${location.name}`
                          : `View ${location.name}`}
                        title={mapLevel === "property"
                          ? `Go to ${location.name}`
                          : `View ${location.name}`}
                      >
                        <span className="map-marker-x">×</span>
                        <span className="map-marker-label">
                          <strong>{location.name}</strong>
                          <small>{location.subtitle}</small>
                        </span>
                      </button>
                    );
                  })}

                <div className="map-compass" aria-label="North is up">
                  <span>N</span>
                  <span>↑</span>
                </div>

                <div className="map-zoom-controls">
                  <button
                    type="button"
                    onClick={() => {
                      if (mapLevel === "regional") openRegion("old-town");
                      else if (mapLevel === "neighbourhood") {
                        const location = mapLocations.find((item) =>
                          item.discovered && item.regionId === selectedRegionId &&
                          item.propertyImage
                        );
                        if (location) openLocation(location);
                      }
                    }}
                    disabled={mapLevel === "property"}
                    aria-label="Zoom in"
                    title="Zoom in"
                  >+
                  </button>
                  <button
                    type="button"
                    onClick={goMapBack}
                    disabled={mapLevel === "regional"}
                    aria-label="Zoom out"
                    title="Zoom out"
                  >−
                  </button>
                </div>
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

        <button
          className="latch-hotspot"
          type="button"
          aria-label="Close organizer"
        />

      </section>

    </main>
  );
}