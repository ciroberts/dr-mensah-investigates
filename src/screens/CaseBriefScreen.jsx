import "../styles/case-brief.css";
import CaseBriefDocument from "../components/case-brief/CaseBriefDocument";
import scandburyBrief from "../cases/001-Scandbury/brief";

export default function CaseBriefScreen() {
  return (
    <main className="case-brief-screen">
      <CaseBriefDocument caseData={scandburyBrief} />
    </main>
  );
}