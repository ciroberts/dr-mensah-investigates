import { useRef, useState } from "react";

export default function LookInteractionPoint({ side, label, onActivate, onIntent, disabled = false }) {
  const [touchRevealed, setTouchRevealed] = useState(false);
  const suppressTouchClick = useRef(false);

  const handlePointerDown = (event) => {
    if (disabled) return;
    onIntent?.();
    if (event.pointerType === "touch" && !touchRevealed) {
      event.preventDefault();
      suppressTouchClick.current = true;
      setTouchRevealed(true);
    }
  };

  const handleClick = () => {
    if (disabled) return;
    // Touch deliberately uses first tap = reveal/preload, second tap = turn.
    if (suppressTouchClick.current) {
      suppressTouchClick.current = false;
      return;
    }
    onActivate?.();
    setTouchRevealed(false);
  };

  return (
    <div
      className={`look-zone look-zone--${side}${touchRevealed ? " look-zone--touch-revealed" : ""}`}
      onPointerEnter={() => !disabled && onIntent?.()}
      onPointerLeave={() => setTouchRevealed(false)}
      aria-hidden={disabled ? "true" : undefined}
    >
      <button
        type="button"
        className="look-point scene-marker"
        onPointerDown={handlePointerDown}
        onFocus={() => !disabled && onIntent?.()}
        onClick={handleClick}
        aria-label={label}
        disabled={disabled}
      >
        <span className="scene-marker__pulse" aria-hidden="true" />
        <span className="scene-marker__dot" aria-hidden="true" />
        <span className="scene-marker__label">{label}</span>
      </button>
    </div>
  );
}
