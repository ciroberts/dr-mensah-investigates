import { useEffect, useRef, useState } from "react";

export default function TravelInteractionPoint({ destination, arrivalPoints, onTravel }) {
  const [choosingArrival, setChoosingArrival] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    setChoosingArrival(false);
  }, [destination?.id]);

  useEffect(() => {
    if (!choosingArrival) return;
    const dismiss = (event) => {
      if (!rootRef.current?.contains(event.target)) setChoosingArrival(false);
    };
    window.addEventListener("pointerdown", dismiss);
    return () => window.removeEventListener("pointerdown", dismiss);
  }, [choosingArrival]);

  if (!destination || !arrivalPoints?.length) return null;

  const handleTravelPoint = () => {
    if (arrivalPoints.length === 1) {
      onTravel(destination.id, arrivalPoints[0]);
      return;
    }
    setChoosingArrival((current) => !current);
  };

  return (
    <div className="travel-interaction" ref={rootRef}>
      <button
        type="button"
        className="travel-interaction__point"
        onClick={handleTravelPoint}
        aria-expanded={arrivalPoints.length > 1 ? choosingArrival : undefined}
      >
        <span className="travel-interaction__pulse" aria-hidden="true" />
        <span className="travel-interaction__dot" aria-hidden="true" />
        <span className="travel-interaction__label">Travel to {destination.name}</span>
      </button>

      {choosingArrival && arrivalPoints.length > 1 && (
        <div className="travel-arrival-menu" role="menu" aria-label={`Arrival point for ${destination.name}`}>
          <small>Choose arrival point</small>
          {arrivalPoints.map((arrival) => (
            <button
              key={arrival.id}
              type="button"
              role="menuitem"
              onClick={() => onTravel(destination.id, arrival)}
            >
              {arrival.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
