// Case 001 Collab*Notes seed data.
// These are facts the team legitimately knows before the player reaches Scandbury.
// Later field entries should be appended from authored case events rather than used as an activity log.
export const AMARA_HANDLE = "MaraMara09";

export const initialCollabNotes = [
  {
    id: "case-001-briefing",
    createdBy: "Amara Okoye",
    username: AMARA_HANDLE,
    sharedWith: "Case 001 team",
    time: "Case 001",
    title: "The Vanishing of Edward Scandbury",
    subtitle: "Initial Case Briefing",
    content: [
      "Edward Scandbury, 67, disappeared from his estate four days ago.",
      "No signs of forced entry have been reported.",
      "No ransom demand has been received and there are no confirmed sightings.",
      "Scandbury Mansion is the primary known location and Edward's last known location."
    ],
    amaraNote: true,
  },
  {
    id: "case-001-household-contact",
    createdBy: "Amara Okoye",
    username: AMARA_HANDLE,
    sharedWith: "Case 001 team",
    time: "Before arrival",
    title: "Scandbury Mansion",
    subtitle: "Primary Household Contact",
    content: [
      "Amelia Scandbury — Edward Scandbury's wife.",
      "Ask for Amelia on arrival at the mansion.",
      "Amelia is associated with Scandbury Pharmacy."
    ],
    amaraNote: true,
  },
];

// Template/utility for later authored procedural events. The player's chosen
// handle will be supplied by onboarding; do not invent a protagonist identity.
export function createInvestigatorLogEntry({ id, playerHandle, time, title, subtitle, content }) {
  return {
    id,
    createdBy: "Investigator",
    username: playerHandle,
    sharedWith: `${AMARA_HANDLE} · Case 001 team`,
    time,
    title,
    subtitle,
    content,
  };
}
