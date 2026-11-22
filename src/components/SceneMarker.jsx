import { useEffect, useRef, useState } from "react";

export default function SceneMarker({ marker, discovered, onDiscover, onActivate }) {
  const markerRef = useRef(null);
  const [nearby, setNearby] = useState(marker.type !== "proximity" || discovered);

  useEffect(() => {
    if (marker.type !== "proximity" || discovered) {
      setNearby(true);
      return;
    }

    const checkPointer = (event) => {
      const node = markerRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const distance = Math.hypot(event.clientX - cx, event.clientY - cy);
      setNearby(distance <= (marker.radius ?? 100));
    };

    window.addEventListener("pointermove", checkPointer, { passive: true });
    window.addEventListener("pointerdown", checkPointer, { passive: true });
    return () => { window.removeEventListener("pointermove", checkPointer); window.removeEventListener("pointerdown", checkPointer); };
  }, [marker.id, marker.radius, marker.type, discovered]);

  const visible = marker.type !== "proximity" || discovered || nearby;

  const handleClick = () => {
    if (!visible) return;
    if (marker.type === "proximity" && !discovered) onDiscover?.(marker.id);
    onActivate?.(marker);
  };

  const handlePointerDown = (event) => {
    if (visible || marker.type !== "proximity") return;
    const rect = markerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    if (Math.hypot(event.clientX - cx, event.clientY - cy) <= (marker.radius ?? 100)) {
      setNearby(true);
    }
  };

  return (
    <div
      ref={markerRef}
      className={`scene-marker-anchor${visible ? " scene-marker-anchor--visible" : ""}`}
      style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
      onPointerDown={handlePointerDown}
    >
      <button type="button" className="scene-marker" aria-label={marker.label} tabIndex={0} onFocus={() => setNearby(true)} onBlur={() => { if (!discovered && marker.type === "proximity") setNearby(false); }} onClick={handleClick}>
        <span className="scene-marker__pulse" aria-hidden="true" />
        <span className="scene-marker__dot" aria-hidden="true" />
        <span className="scene-marker__label">{marker.label}</span>
      </button>
    </div>
  );
}
