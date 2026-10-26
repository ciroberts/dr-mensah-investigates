export default function LocationTitle({ title, subtitle }) {
  if (!title) return null;

  return (
    <div className="location-title" aria-live="polite">
      <div className="location-title__lead" aria-hidden="true">
        <span className="location-title__spark">✦</span>
        <span className="location-title__line" />
      </div>
      <div className="location-title__copy">
        <strong>{title}</strong>
        {subtitle ? <span>{subtitle}</span> : null}
      </div>
    </div>
  );
}
