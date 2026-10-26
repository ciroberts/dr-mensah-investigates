export default function FieldHud({ position, onPointerDown, onPointerMove, onPointerUp, onPointerCancel, onOpenOrganizer, unreadCount = 0 }) {
  return (
    <div
      className="field-hud"
      style={{ left: `${position.x * 100}%`, top: `${position.y * 100}%` }}
      aria-label="Field controls"
    >
      <button
        type="button"
        className="field-hud__drag-handle"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        aria-label="Move field controls"
        title="Drag to move field controls"
      >
        <span aria-hidden="true" />
      </button>
      <button
        type="button"
        className="field-hud__control field-hud__control--organizer"
        onClick={(event) => { event.stopPropagation(); onOpenOrganizer?.(); }}
        aria-label="Open field organizer"
        title="Open organizer"
      >
<img src="/assets/organizer/organizer-icon.webp" alt="" draggable="false" />
        {unreadCount > 0 && <span className="field-hud__unread" aria-label={`${unreadCount} unseen updates`}>{unreadCount > 99 ? "99+" : unreadCount}</span>}
      </button>

      <button
        type="button"
        className="field-hud__control field-hud__control--inventory"
        onClick={(event) => event.stopPropagation()}
        aria-label="Inventory — coming soon"
        title="Inventory"
      >
        <span className="inventory-pouch" aria-hidden="true">
          <span className="inventory-pouch__flap" />
          <span className="inventory-pouch__stud" />
        </span>
      </button>
    </div>
  );
}
