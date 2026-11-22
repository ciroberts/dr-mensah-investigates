import test from 'node:test';
import assert from 'node:assert/strict';
import { CASE_PROGRESS_KEY, INTAKE_EVENT_ID, emptyProgress, readProgress, registerIntake, saveProgress } from '../src/state/caseProgress.js';

const report = { id: 'case-001-intake-original', title: 'Original assignment', preliminarySummary: ['Known at intake'] };
const storage = () => {
  const entries = new Map();
  return { getItem: (key) => entries.get(key) ?? null, setItem: (key, value) => entries.set(key, value) };
};

test('completion registers a stable event, a detached original document, and the destination', () => {
  const source = structuredClone(report);
  const progress = registerIntake(emptyProgress(), source, 'scandbury-mansion');
  source.preliminarySummary.push('Later evidence');
  assert.deepEqual(progress.events, [INTAKE_EVENT_ID]);
  assert.deepEqual(progress.documents[report.id], report);
  assert.deepEqual(progress.discoveredLocationIds, ['scandbury-mansion']);
});

test('repeat completion preserves the original and adds no duplicate event or destination', () => {
  const progress = registerIntake(emptyProgress(), report, 'scandbury-mansion');
  const repeated = registerIntake(progress, { ...report, title: 'Later revision' }, 'scandbury-mansion');
  assert.strictEqual(repeated, progress);
  assert.equal(repeated.documents[report.id].title, 'Original assignment');
});

test('registration preserves unrelated saved investigation data across reload', () => {
  const store = storage();
  const before = { ...emptyProgress(), events: ['other-event'], documents: { other: { id: 'other' } }, discoveredLocationIds: ['other-place'], locationId: 'investigator-desk', sceneId: 'desk-main' };
  const after = registerIntake(before, report, 'scandbury-mansion');
  assert.equal(saveProgress(store, after), true);
  const restored = readProgress(store);
  assert.deepEqual(restored, after);
  assert.strictEqual(registerIntake(restored, report, 'scandbury-mansion'), restored);
});

test('malformed or unsupported stored data safely falls back to a fresh assignment', () => {
  const store = storage();
  for (const value of ['broken', 'null', '{"version":2}', '{"version":1,"events":[],"documents":[],"discoveredLocationIds":[]}']) {
    store.setItem(CASE_PROGRESS_KEY, value);
    assert.deepEqual(readProgress(store), emptyProgress());
  }
});

test('denied storage is reported without preventing in-session registration', () => {
  const denied = { getItem() { throw Error('denied'); }, setItem() { throw Error('denied'); } };
  assert.deepEqual(readProgress(denied), emptyProgress());
  assert.equal(saveProgress(denied, registerIntake(emptyProgress(), report, 'scandbury-mansion')), false);
});


test('another case uses its own document and event IDs without replacing existing intake', () => {
  const first = registerIntake(emptyProgress(), report, 'scandbury-mansion');
  const next = registerIntake(first, { id: 'case-002-intake-original', title: 'Second case' }, 'another-location');
  assert.equal(next.events.length, 2);
  assert.equal(Object.keys(next.documents).length, 2);
  assert.deepEqual(next.documents[report.id], report);
});
