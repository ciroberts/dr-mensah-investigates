# Case intake and opening sequence

## Implemented

The player is a newly appointed investigator at Mensah Investigations, distinct from supervising investigator Dr. Kofi Mensah. Amara Okoye coordinates the case.

The existing opening letter and photograph are retained, with a restrained CSS official seal. Continuing fades through the existing black curtain into the office desk. The organiser and map remain closed. The case-package hotspot now uses the existing proximity mechanic and is labelled **Inspect Case Brief**. Its original focus zoom and lens cues lead into the HTML report; Return to desk or Escape closes it with the existing return-inspection sound.

`src/components/documents/CaseIntakeReport.jsx` renders case-independent document data. It supports case reference/title, date opened, assignee, supervisor, coordinator, classification, priority/status, reporting party/contact, location/dates, summary, attachments, photographs, objective, direction, and filing reference. Absent optional fields/sections are omitted. Text remains selectable HTML, with ivory paper, subtle existing paper texture, centred letterhead, paired case-summary fields, formal shaded section bands and ruled rows, a supporting-photograph column, an oval red Official Copy stamp, and a responsive scrolling inspection dialog. The layout follows the supplied visual mockup while retaining selectable text and the approved Scandbury photograph. Native modal focus containment and Escape are supported. Proximity dots also reveal on keyboard focus and nearby touch, preserving pointer proximity behavior.

`src/cases/001-Scandbury/intakeReport.js` contains the original Case 001 data, sourced from `brief.js`, canonical `collabNotes.js`, established authored communications, and the clarified player role. It uses the existing Scandbury photograph. Future cases supply another report object with a globally stable `id`, case reference/title, and applicable fields; no interface redesign is needed. Attachment objects use `{ id, label, href?, description? }`; photographs use `{ id, src, alt?, caption? }`. Section text accepts a string or an array of paragraphs.

Closing the initial desk report completes the briefing: registration captures a detached copy once, records a stable completion event derived from the report ID, and unlocks the mansion map destination. **Pear → Files → Case Intake Report** reopens that original record from any investigation location. It never updates with subsequent evidence. Reinspection is idempotent and does not open the organiser or map automatically.

`src/state/caseProgress.js` stores versioned local progress under `mensah-investigations.case-001.v1`: opening-letter completion, event IDs, original documents, discovered destinations, scene/view, and discovered hotspots. Reload returns to the saved scene; close inspection resumes at the desk. Storage exceptions retain in-session functionality and show a save warning. Future cases can pass their own storage key to the read/save functions; report registration derives distinct event IDs for each report. Communication history and notebook interaction state are not yet persisted; cloud sync and a full investigation save model remain future work. No pre-existing save schema existed in this prototype.

The organiser now uses the existing canonical pre-arrival collaboration records instead of demonstration interviews, pharmacy findings, and deeds. The supplied source archive contains newer directional turns, forward/backward movement, image preloading, inspection history/Back controls, cover-image hotspot coordinates, video-overlay support, and message visibility/pending-response fixes. These have been merged with the intake workflow rather than replaced by the earlier checkout implementation. The installed approved artwork, original arrival-title timing, and existing sounds remain in use. The archive’s scene-specific asset changes are deferred where their files were not included; see the asset list below. No office environmental-audio loop was supplied.

The production CSS error caused by plain prose in `case-brief.css` has been corrected as a comment, retaining its intended styling.

## Canonical and visual information still required

- Exact date opened and calendar dates for disappearance/last sighting.
- Named player investigator, if desired; no name has been invented.
- Reporting party, verified contact details, priority, initial administrative status, and internal filing reference.
- A precise street/postal address, if it should appear; the established destination is Scandbury Mansion, Old Town, Aldercombe.
- The supplied visual mockup now guides the document layout. Its placeholder assignee, dates, reporting party, contact and case classification have not been copied. The heraldic crest is not supplied as a separate approved asset; a restrained typographic MI mark and CSS oval stamp are used.
- The uploaded `src.zip` omits `exterior-front-closed.webp`, `exterior-front-open.webp`, `exterior-left.webp`, `exterior-right.webp`, `intercom-close.webp`, and `front-foliage-mask.svg` referenced by its scene data. The existing PNG views and gate-close artwork/navigation remain functional. The uploaded optical-inspection renderer and ambient-video support are retained, but the separate intercom plate and masked mansion video cannot be validated or activated as authored until those assets are supplied. The existing motion MP4 is preserved.
- The uploaded canonical `collabNotes.js` contains only the initial briefing, unlike the earlier checkout’s household-contact entry. New intake records therefore omit an unconfirmed named primary contact and instruct attendance for preliminary enquiries. Existing saved original records remain immutable.
- The desk artwork includes a boarding-pass prop; its printed date/destination are not treated as canonical case metadata.

## Development and validation

Use Node 24 (verified) and `npm ci`, then `npm run dev`. No backend or credentials are required.

- `npm run build`: production bundle.
- `npm run lint`: existing seven warnings in communications/organiser hooks and unused prototype controls.
- `node --test tests/caseProgress.test.js`: original-record immutability, idempotence, reload/preservation, malformed saves, denied storage, independent future-case registration.
- Browser acceptance: fresh letter → desk with organiser closed → proximity inspection → close → reopen/reload with one registered original → Pear Files → original report → map → mansion arrival → directional turn and gate movement → original report still accessible. Check touch inspection and report width at 390px. Audio cue dispatch can be checked separately from subjective listening.

Validation completed against the supplied-source merge: production build and six progress tests pass; lint passes with seven pre-existing warnings.

The existing organiser still scales its full desktop composition down on phones; its broader mobile layout is outside this change. Existing Calls placeholders and other unrelated prototype controls remain. The report itself uses the full viewport on mobile.

## Intercom correction

The roadside intercom marker is restored to image coordinates (38.9%, 61.7%) and uses proximity discovery. It opens an `intercom-close` inspection using the existing optical zoom and lens sounds. The call button has a separate proximity marker at (38.9%, 63.1%). Image-authored focus scenes transform the artwork and hotspots together, keeping the physical button aligned after cover cropping on desktop and mobile. Existing desk focus scenes retain their original framing.

Removed the temporary roadside handlers that toggled the gate artwork immediately, the closed-gate travel shortcut, and the legacy courtyard bypass. The call button currently reports an unavailable connection; it does not open the gate. Future authored intercom dialogue must explicitly authorize the gate-opening fade before exposing the courtyard/central-palm progression. Open-gate and courtyard scenes remain authored for that future outcome.

The separate `intercom-close.webp` was not supplied. The inspection currently magnifies the approved roadside artwork, which is visibly softer than a dedicated detail plate. No substitute image was generated. The existing inspection-history Back control restores the approach view. Reloading mid-inspection returns to the roadside to avoid a missing Back history.

Verified in desktop (1440×900) and mobile (390×844) browser checks: proximity visibility, focus inspection, onscreen/aligned button, call without gate opening, no courtyard bypass, Back, reload recovery, lens-in/out cues, and absence of footsteps during inspection. Build and lint also checked; existing unrelated lint warnings remain.
