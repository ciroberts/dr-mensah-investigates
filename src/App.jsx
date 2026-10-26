import { useEffect, useRef, useState } from "react";
import CaseBriefScreen from "./screens/CaseBriefScreen";
import OrganizerScreen from "./screens/OrganizerScreen";
import InvestigationScene from "./scenes/InvestigationScene";
import FieldHud from "./components/FieldHud";
import LocationTitle from "./components/LocationTitle";
import MeaningfulAudioIndicator from "./components/MeaningfulAudioIndicator";
import { INITIAL_LOCATION_ID, INITIAL_SCENE_ID, getLocation, getScene } from "./cases/001-Scandbury/sceneData";
import "./styles/organizer-transition.css";
import "./styles/scenes.css";

const CLOSED_IMAGE = "/assets/organizer/organizer-closed.webp";
const ANIMATION_MS = 650;
const TRAVEL_FADE_OUT_MS = 650;
const TRAVEL_FADE_IN_MS = 900;
const TITLE_DELAY_MS = 420;
const TITLE_LIFETIME_MS = 5000;
// One cinematic black curtain for movement and viewpoint turns.
// Fade out 350ms -> remain black 300ms -> fade in 450ms.
const CINEMATIC_FADE_OUT_MS = 350;
const CINEMATIC_BLACK_HOLD_MS = 300;
const CINEMATIC_FADE_IN_MS = 450;
const REDUCED_FADE_OUT_MS = 90;
const REDUCED_BLACK_HOLD_MS = 120;
const REDUCED_FADE_IN_MS = 90;
const FOCUS_AUDIO_LEAD_MS = 95;
const FOCUS_SOUND_IN = "/assets/audio/focus/focus-zoom-in.mp3";
const FOCUS_SOUND_OUT = "/assets/audio/focus/focus-zoom-out.mp3";
const FOOTSTEP_VARIANTS = {
  pavement: "/assets/audio/footsteps/pavement/step-01.mp3",
  gravel: "/assets/audio/footsteps/gravel/step-01.mp3",
  wood: "/assets/audio/footsteps/wood/step-01.mp3",
  hard: "/assets/audio/footsteps/hard/step-01.mp3",
  soft: "/assets/audio/footsteps/soft/step-01.mp3",
};
// Keep decoded/loaded focus cues ready. Creating an Audio object at click time
// can make the sound arrive after a CSS animation has already begun.
const focusSounds = new Map();
function getFocusSound(src) {
  if (!focusSounds.has(src)) {
    const sound = new Audio(src);
    sound.preload = "auto";
    sound.load();
    focusSounds.set(src, sound);
  }
  return focusSounds.get(src);
}
function playEffect(src, volume = 0.5) {
  const sound = src === FOCUS_SOUND_IN || src === FOCUS_SOUND_OUT
    ? getFocusSound(src) : new Audio(src);
  sound.pause();
  sound.currentTime = 0;
  sound.volume = volume;
  sound.play().catch(() => {}); // Audio failures must not interrupt navigation.
}
const HUD_SAFE_PX = 12;
const HUD_WIDTH = 60;
const HUD_HEIGHT = 146;

function clampHud(position) {
  const vw = Math.max(window.innerWidth, 1);
  const vh = Math.max(window.innerHeight, 1);
  const halfW = HUD_WIDTH / 2;
  const halfH = HUD_HEIGHT / 2;
  return {
    x: Math.min((vw - halfW - HUD_SAFE_PX) / vw, Math.max((halfW + HUD_SAFE_PX) / vw, position.x)),
    y: Math.min((vh - halfH - HUD_SAFE_PX) / vh, Math.max((halfH + HUD_SAFE_PX) / vh, position.y)),
  };
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("brief");
  const [currentLocationId, setCurrentLocationId] = useState(INITIAL_LOCATION_ID);
  const [currentSceneId, setCurrentSceneId] = useState(INITIAL_SCENE_ID);
  const [currentViewId, setCurrentViewId] = useState(null);
  const [lookTransition, setLookTransition] = useState(null);
  const [movementTransition, setMovementTransition] = useState(null);
  const [discoveredMarkers, setDiscoveredMarkers] = useState(() => new Set());
  const [organizerOpen, setOrganizerOpen] = useState(true);
  const [transition, setTransition] = useState("idle");
  const [hudPosition, setHudPosition] = useState({ x: 0.955, y: 0.84 });
  const [travelCurtainVisible, setTravelCurtainVisible] = useState(false);
  const [travelActive, setTravelActive] = useState(false);
  const [locationTitle, setLocationTitle] = useState(null);
  const [organizerUnread, setOrganizerUnread] = useState(0);
  const [meaningfulAudio] = useState({ active: false, firstUse: false });
  const timer = useRef(null);
  const travelTimers = useRef([]);
  const lookTimers = useRef([]);
  const movementTimers = useRef([]);
  const focusTimers = useRef([]);
  const drag = useRef(null);
  const moved = useRef(false);

  useEffect(() => () => {
    clearTimeout(timer.current);
    travelTimers.current.forEach(clearTimeout);
    lookTimers.current.forEach(clearTimeout);
    movementTimers.current.forEach(clearTimeout);
    focusTimers.current.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    getFocusSound(FOCUS_SOUND_IN);
    getFocusSound(FOCUS_SOUND_OUT);
  }, []);

  useEffect(() => {
    const keepHudVisible = () => setHudPosition((current) => clampHud(current));
    keepHudVisible();
    window.addEventListener("resize", keepHudVisible);
    return () => window.removeEventListener("resize", keepHudVisible);
  }, []);

  const closeOrganizer = () => {
    if (transition !== "idle" || !organizerOpen || travelActive) return;
    setTransition("closing");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setOrganizerOpen(false);
      setTransition("idle");
    }, ANIMATION_MS);
  };

  const openOrganizer = () => {
    if (transition !== "idle" || organizerOpen || travelActive) return;
    setTransition("opening");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setOrganizerOpen(true);
      setTransition("idle");
    }, ANIMATION_MS);
  };

  const handleTravel = (locationId, arrivalPoint) => {
    const destination = getLocation(locationId);
    if (!destination || travelActive) return;

    const destinationSceneId = arrivalPoint?.sceneId || destination.initialSceneId;
    const destinationScene = getScene(destination.id, destinationSceneId);

    // Pear may still display the current property for reference, but selecting
    // the arrival point for the scene we are already standing in is not travel.
    // Do not replay the fade/title sequence or fake a journey.
    if (destination.id === currentLocationId && destinationSceneId === currentSceneId) return;

    travelTimers.current.forEach(clearTimeout);
    travelTimers.current = [];
    setLocationTitle(null);
    setTravelActive(true);
    setTravelCurtainVisible(true);

    // Travel begins from the map. Put the organizer away beneath the fade rather
    // than showing the normal organizer-to-HUD stow animation during the cut.
    setOrganizerOpen(false);
    setTransition("idle");

    travelTimers.current.push(setTimeout(() => {
      setCurrentLocationId(destination.id);
      setCurrentSceneId(destinationSceneId);
      setCurrentViewId(destinationScene?.initialViewId || null);
      setLookTransition(null);
      setTravelCurtainVisible(false);

      travelTimers.current.push(setTimeout(() => {
        setTravelActive(false);
      }, TRAVEL_FADE_IN_MS));

      if (destinationScene?.locationTitle) {
        travelTimers.current.push(setTimeout(() => {
          setLocationTitle(destinationScene.locationTitle);
          travelTimers.current.push(setTimeout(() => setLocationTitle(null), TITLE_LIFETIME_MS));
        }, TITLE_DELAY_MS));
      }
    }, TRAVEL_FADE_OUT_MS));
  };

  const discoverMarker = (markerId) => {
    setDiscoveredMarkers((current) => {
      if (current.has(markerId)) return current;
      const next = new Set(current);
      next.add(markerId);
      return next;
    });
  };

  const activateSceneMarker = (marker) => {
    // Temporary gate-state preview; keeps physical position unchanged.
    if (marker.id === "scandbury-intercom-front") {
      setCurrentViewId("front-open");
      return;
    }
    if (marker.id === "scandbury-intercom-open") {
      setCurrentViewId("front");
      return;
    }
    if (!marker.targetSceneId || movementTransition || lookTransition || travelActive || focusTimers.current.length) return;
    const nextScene = getScene(currentLocationId, marker.targetSceneId);
    const currentScene = getScene(currentLocationId, currentSceneId);
    if (!nextScene) return;

    // Close inspection stays immediate, with one precise mechanical cue in each direction.
    if (currentLocationId === "investigator-desk" && Boolean(nextScene.focus || currentScene?.focus)) {
      // Sound starts on activation; visuals follow just behind it so the
      // mechanical cue leads the lens movement rather than chasing it.
      playEffect(nextScene.focus ? FOCUS_SOUND_IN : FOCUS_SOUND_OUT, nextScene.focus ? 0.52 : 0.46);
      focusTimers.current.push(setTimeout(() => {
        setCurrentSceneId(marker.targetSceneId);
        setCurrentViewId(nextScene.initialViewId || null);
        focusTimers.current = [];
      }, FOCUS_AUDIO_LEAD_MS));
      return;
    }

    const motion = marker.transition?.type;
    // Non-travel object interactions retain immediate scene swaps.
    if (motion !== "warp" && motion !== "walk") {
      setCurrentSceneId(marker.targetSceneId);
      setCurrentViewId(nextScene.initialViewId || null);
      return;
    }

    movementTimers.current.forEach(clearTimeout);
    movementTimers.current = [];
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const fadeOut = reducedMotion ? REDUCED_FADE_OUT_MS : CINEMATIC_FADE_OUT_MS;
    const hold = reducedMotion ? REDUCED_BLACK_HOLD_MS : CINEMATIC_BLACK_HOLD_MS;
    const fadeIn = reducedMotion ? REDUCED_FADE_IN_MS : CINEMATIC_FADE_IN_MS;
    setMovementTransition({ type: "fade", fadeOut, hold, fadeIn });

    const surface = marker.transition?.surface || "pavement";
    const footstep = FOOTSTEP_VARIANTS[surface] || FOOTSTEP_VARIANTS.pavement;
    // Step sounds belong to physical movement only, not left/right looking.
    movementTimers.current.push(setTimeout(() => playEffect(footstep, 0.37), Math.round(fadeOut * 0.55)));
    // Swap the underlying photograph when the black curtain is fully opaque.
    movementTimers.current.push(setTimeout(() => {
      setCurrentSceneId(marker.targetSceneId);
      setCurrentViewId(nextScene.initialViewId || null);
    }, fadeOut + Math.round(hold / 2)));
    movementTimers.current.push(setTimeout(() => {
      setMovementTransition(null);
      movementTimers.current = [];
    }, fadeOut + hold + fadeIn));
  };

  const preloadView = (targetViewId) => {
    const currentScene = getScene(currentLocationId, currentSceneId);
    const targetImage = currentScene?.views?.[targetViewId]?.image;
    if (!targetImage) return;
    const image = new Image();
    image.decoding = "async";
    image.src = targetImage;
  };

  const handleLook = (direction, targetViewId) => {
    if (!targetViewId || movementTransition || lookTransition || travelActive || organizerVisible) return;
    const currentScene = getScene(currentLocationId, currentSceneId);
    if (!currentScene?.views?.[targetViewId]) return;

    movementTimers.current.forEach(clearTimeout);
    movementTimers.current = [];
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const fadeOut = reducedMotion ? REDUCED_FADE_OUT_MS : CINEMATIC_FADE_OUT_MS;
    const hold = reducedMotion ? REDUCED_BLACK_HOLD_MS : CINEMATIC_BLACK_HOLD_MS;
    const fadeIn = reducedMotion ? REDUCED_FADE_IN_MS : CINEMATIC_FADE_IN_MS;
    setMovementTransition({ type: "fade", fadeOut, hold, fadeIn });
    movementTimers.current.push(setTimeout(() => {
      setCurrentViewId(targetViewId);
    }, fadeOut + Math.round(hold / 2)));
    movementTimers.current.push(setTimeout(() => {
      setMovementTransition(null);
      movementTimers.current = [];
    }, fadeOut + hold + fadeIn));
  };

  const onHudPointerDown = (event) => {
    if (transition !== "idle" || travelActive) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY, start: hudPosition };
    moved.current = false;
  };

  const onHudPointerMove = (event) => {
    if (!drag.current) return;
    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;
    if (Math.hypot(dx, dy) > 5) moved.current = true;
    if (!moved.current) return;
    setHudPosition(clampHud({
      x: drag.current.start.x + dx / window.innerWidth,
      y: drag.current.start.y + dy / window.innerHeight,
    }));
  };

  const onHudPointerUp = () => { drag.current = null; };
  const onHudPointerCancel = () => { drag.current = null; };

  if (currentScreen === "brief") {
    return <CaseBriefScreen onBeginInvestigation={() => setCurrentScreen("investigation")} />;
  }

  const scene = getScene(currentLocationId, currentSceneId);
  const organizerVisible = organizerOpen && transition !== "closing";
  const canWorldTravel = Boolean(scene?.allowsWorldTravel);

  return (
    <div className="investigation-shell">
      <div className={`investigation-world${organizerVisible ? " investigation-world--organizer-open" : ""}`}>
        <InvestigationScene
          scene={scene}
          viewId={currentViewId || scene?.initialViewId || null}
          lookTransition={lookTransition}
          movementTransition={movementTransition}
          onLook={handleLook}
          onLookIntent={preloadView}
          discoveredMarkers={discoveredMarkers}
          onDiscoverMarker={discoverMarker}
          onMarkerActivate={activateSceneMarker}
        />
      </div>

      <div className={`organizer-layer ${organizerVisible ? "organizer-layer--visible" : ""}`}>
        <OrganizerScreen
          isVisible={organizerVisible}
          onClose={closeOrganizer}
          onTravel={handleTravel}
          canWorldTravel={canWorldTravel}
          currentLocationId={currentLocationId}
          currentSceneId={currentSceneId}
          onUnreadChange={setOrganizerUnread}
        />
      </div>

      {transition !== "idle" && !travelActive && (
        <img
          className={`organizer-flying organizer-flying--${transition}`}
          src={CLOSED_IMAGE}
          alt=""
          aria-hidden="true"
          style={{ "--dock-x": `${hudPosition.x * 100}vw`, "--dock-y": `${hudPosition.y * 100}vh` }}
        />
      )}

      {!organizerOpen && transition === "idle" && !travelActive && (
        <FieldHud
          position={hudPosition}
          onPointerDown={onHudPointerDown}
          onPointerMove={onHudPointerMove}
          onPointerUp={onHudPointerUp}
          onPointerCancel={onHudPointerCancel}
          onOpenOrganizer={openOrganizer}
          unreadCount={organizerUnread}
        />
      )}

      {locationTitle && !organizerVisible && (
        <LocationTitle key={`${locationTitle.title}-${currentSceneId}`} {...locationTitle} />
      )}

      <div
        className={`travel-curtain${travelCurtainVisible ? " travel-curtain--visible" : ""}`}
        aria-hidden="true"
      />


      <MeaningfulAudioIndicator active={meaningfulAudio.active} firstUse={meaningfulAudio.firstUse} />
    </div>
  );
}
