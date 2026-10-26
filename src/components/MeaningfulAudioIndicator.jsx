export default function MeaningfulAudioIndicator({ active = false, firstUse = false }) {
  if (!active) return null;
  return (
    <div className="meaningful-audio-indicator" role="status" aria-live="polite">
      <span className="meaningful-audio-indicator__speaker" aria-hidden="true">🔊</span>
      {firstUse && <strong>AUDIO PLAYING</strong>}
      <span className="meaningful-audio-indicator__bars" aria-hidden="true"><i /><i /><i /><i /><i /></span>
    </div>
  );
}
