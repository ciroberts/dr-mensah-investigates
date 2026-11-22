export const CASE_PROGRESS_KEY = "mensah-investigations.case-001.v1";
export const INTAKE_EVENT_ID = "case-001-intake-original:briefing-completed:v1";
export const emptyProgress = () => ({ version: 1, openingRead: false, events: [], documents: {}, discoveredLocationIds: [] });

export function readProgress(storage, key = CASE_PROGRESS_KEY) {
  try {
    const saved = JSON.parse(storage.getItem(key));
    if (!saved || saved.version !== 1 || !Array.isArray(saved.events) || !saved.documents || Array.isArray(saved.documents) || typeof saved.documents !== "object" || !Array.isArray(saved.discoveredLocationIds)) return emptyProgress();
    return { ...emptyProgress(), ...saved };
  } catch { return emptyProgress(); }
}

// Stable event and document IDs make repeated inspection/replay harmless.
// Capture the intake on first registration; never rewrite it with later facts.
export function registerIntake(progress, report, locationId) {
  const eventId = `${report.id}:briefing-completed:v1`;
  if (progress.events.includes(eventId) && progress.documents[report.id] && progress.discoveredLocationIds.includes(locationId)) return progress;
  return {
    ...progress,
    events: [...new Set([...progress.events, eventId])],
    documents: { ...progress.documents, [report.id]: progress.documents[report.id] ?? structuredClone(report) },
    discoveredLocationIds: [...new Set([...progress.discoveredLocationIds, locationId])],
  };
}

export function saveProgress(storage, progress, key = CASE_PROGRESS_KEY) {
  try { storage.setItem(key, JSON.stringify(progress)); return true; }
  catch { return false; }
}
