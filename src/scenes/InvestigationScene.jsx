import SceneMarker from "../components/SceneMarker";
import LookInteractionPoint from "../components/LookInteractionPoint";

function SceneAtmosphere({ atmosphere }) {
  if (!atmosphere) return null;
  return (
    <div className="scene-atmosphere" aria-hidden="true">
      {atmosphere.foliage?.map((layer) => (
        <img key={layer.id} className={`scene-atmosphere__foliage ${layer.className || ""}`} src={layer.image} alt="" draggable="false" />
      ))}
      {atmosphere.driftingLeaves && (
        <div className="scene-atmosphere__leaves">
          <i className="wind-leaf wind-leaf--one" /><i className="wind-leaf wind-leaf--two" /><i className="wind-leaf wind-leaf--three" />
        </div>
      )}
    </div>
  );
}

export default function InvestigationScene({
  scene,
  viewId,
  lookTransition,
  movementTransition,
  onLook,
  onLookIntent,
  discoveredMarkers,
  onDiscoverMarker,
  onMarkerActivate,
}) {
  if (!scene) return null;

  const view = scene.views?.[viewId] || scene.views?.[scene.initialViewId] || null;
  const image = view?.image || scene.image;
  const alt = view?.alt || scene.alt;
  const markers = view?.markers || scene.markers;
  // Atmosphere authored on the base scene currently belongs to the canonical front view.
  const atmosphere = view?.atmosphere ?? ((scene.views && view?.id !== scene.initialViewId) ? null : scene.atmosphere);

  const focusStyle = scene.focus ? {
    "--scene-scale": scene.focus.scale,
    "--scene-origin-x": `${scene.focus.x}%`,
    "--scene-origin-y": `${scene.focus.y}%`,
  } : undefined;

  const turnDirection = lookTransition?.direction || lookTransition;
  const turnTargetViewId = lookTransition?.targetViewId || null;
  const incomingView = turnTargetViewId ? scene.views?.[turnTargetViewId] : null;
  const turnClass = turnDirection ? ` world-scene--turning world-scene--turning-${turnDirection}` : "";
  const walkClass = movementTransition && movementTransition.type !== "fade" ? ` world-scene--warping world-scene--movement-${movementTransition.type}` : "";

  return (
    <section className={`world-scene${scene.focus ? " world-scene--focus" : ""}${turnClass}${walkClass}`} aria-label={alt}>
      {image ? (
        <div className="world-scene__image-wrap" style={focusStyle}>
          <img className="world-scene__image world-scene__image--current" src={image} alt={alt} draggable="false" />
          {incomingView?.image && (
            <img
              className="world-scene__image world-scene__image--incoming"
              src={incomingView.image}
              alt=""
              aria-hidden="true"
              draggable="false"
            />
          )}
          {movementTransition?.type === "radial" && (
            <svg className="movement-radial-filter-defs" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
              <defs><filter id="mensah-radial-stretch" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
                <feImage href="/assets/effects/radial-displacement.png" x="0" y="0" width="1" height="1" preserveAspectRatio="none" result="displacement"/>
                <feDisplacementMap in="SourceGraphic" in2="displacement" scale="0" xChannelSelector="R" yChannelSelector="G">
                  <animate attributeName="scale" dur="0.62s" values="0;25;90;135;20;0" keyTimes="0;.16;.38;.60;.8;1" fill="freeze" calcMode="linear" />
                </feDisplacementMap>
              </filter></defs>
            </svg>
          )}
          {movementTransition?.targetImage && (
            <img className="world-scene__image world-scene__image--walk-target"
              src={movementTransition.targetImage} alt="" aria-hidden="true" draggable="false" />
          )}
          {!movementTransition && <SceneAtmosphere atmosphere={atmosphere} />}
        </div>
      ) : (
        <div className="world-scene__placeholder"><span>MENSAH INVESTIGATIONS · CASE 001</span><h1>Scandbury Mansion</h1><p>{scene.placeholder}</p></div>
      )}

      {movementTransition?.type === "fade" && (
        <div
          className="world-scene__cinematic-curtain"
          aria-hidden="true"
          style={{
            "--cinematic-fade-out": `${movementTransition.fadeOut}ms`,
            "--cinematic-hold": `${movementTransition.hold}ms`,
            "--cinematic-fade-in": `${movementTransition.fadeIn}ms`,
            "--cinematic-total": `${movementTransition.fadeOut + movementTransition.hold + movementTransition.fadeIn}ms`,
          }}
        />
      )}

      <div className="world-scene__markers">
        {markers?.map((marker) => (
          <SceneMarker key={marker.id} marker={marker} discovered={discoveredMarkers.has(marker.id)} onDiscover={onDiscoverMarker} onActivate={onMarkerActivate} />
        ))}
      </div>

      {view?.look?.left && <LookInteractionPoint side="left" label="Turn Left" onIntent={() => onLookIntent?.(view.look.left)} onActivate={() => onLook?.("left", view.look.left)} disabled={Boolean(lookTransition || movementTransition)} />}
      {view?.look?.right && <LookInteractionPoint side="right" label="Turn Right" onIntent={() => onLookIntent?.(view.look.right)} onActivate={() => onLook?.("right", view.look.right)} disabled={Boolean(lookTransition || movementTransition)} />}
    </section>
  );
}
