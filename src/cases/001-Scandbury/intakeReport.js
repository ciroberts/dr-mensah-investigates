import brief from "./brief";

// Original assignment record. Only established briefing and collaboration facts.
export const scandburyIntakeReport = {
  id: "case-001-intake-original",
  caseReference: "001",
  title: brief.title,
  assignedInvestigator: "Newly appointed investigator, Mensah Investigations",
  supervisingInvestigator: "Dr. Kofi Mensah",
  coordinationContact: "Amara Okoye",
  matterClassification: "Missing person — confidential",
  incidentLocation: "Scandbury Mansion, Old Town, Aldercombe",
  relevantDates: "Disappearance: four days before the initial assignment briefing.",
  preliminarySummary: [
    "Edward Scandbury, 67, has disappeared from his estate. No signs of forced entry, ransom demand or confirmed sightings have been reported.",
    "Several individuals appear to possess motive. Their reasons are not yet fully understood. Scandbury Mansion is the primary known location and Edward’s last known location."
  ],
  photographs: [{ id: "mansion-reference", src: brief.briefPhoto, caption: "Scandbury Mansion — assignment reference photograph" }],
  immediateObjective: "Attend Scandbury Mansion to establish the initial facts and make preliminary observations concerning Edward Scandbury’s disappearance.",
  investigatorsDirection: [
    "Observe before disturbing anything. Distinguish reported information from verified findings. Motive is worth examining; it is never proof.",
    "The address for initial enquiries has been recorded in your case organiser and is available on the accompanying map. Attend the premises to commence the preliminary investigation."
  ],
};
