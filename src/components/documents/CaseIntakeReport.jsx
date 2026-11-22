import OfficialSeal from "./OfficialSeal";
import "../../styles/intake-report.css";

function Section({ title, content, className = "" }) {
  const paragraphs = Array.isArray(content) ? content : content ? [content] : [];
  if (!paragraphs.length) return null;
  return <section className={`intake-section ${className}`}><h2>{title}</h2><div className="intake-section__body">{paragraphs.map((text, index) => <p key={index}>{text}</p>)}</div></section>;
}

function FieldsSection({ title, fields, paired = false }) {
  const present = fields.filter(([, value]) => value);
  if (!present.length) return null;
  return <section className="intake-section"><h2>{title}</h2><dl className={`intake-fields${paired ? " intake-fields--paired" : ""}`}>{present.map(([label, value]) => <div key={label}><dt>{label}:</dt><dd>{value}</dd></div>)}</dl></section>;
}

// Case-independent, semantic HTML; absent data never produces placeholder rows.
export default function CaseIntakeReport({ report }) {
  const materials = report.supportingMaterials ?? [];
  const photographs = report.photographs ?? [];
  const hasMaterials = materials.length > 0 || photographs.length > 0;
  return (
    <article className="intake-paper">
      <header className="intake-letterhead">
        <span className="intake-monogram" aria-hidden="true">M<span>I</span></span>
        <p>MENSAH INVESTIGATIONS</p>
        <div className="intake-letterhead__rule"><span>Private Investigative &amp; Advisory Services</span></div>
      </header>
      <div className="intake-document-heading">
        <h1 id="intake-report-title">Case Intake Report</h1>
        <p>Private &amp; Confidential</p>
        <OfficialSeal />
      </div>
      {report.title && <p className="intake-case-title">{report.title}</p>}
      <FieldsSection title="Case Summary" paired fields={[
        ["Case reference", report.caseReference], ["Date opened", report.dateOpened],
        ["Assigned investigator", report.assignedInvestigator], ["Supervising investigator", report.supervisingInvestigator],
        ["Case coordination", report.coordinationContact], ["Matter classification", report.matterClassification],
        ["Priority", report.priority], ["Initial status", report.initialStatus],
      ]} />
      <FieldsSection title="Reporting Information" fields={[["Reporting party", report.reportingParty], ["Primary contact", report.primaryContact]]} />
      <div className={`intake-body-grid${hasMaterials ? " intake-body-grid--with-materials" : ""}`}>
        <div>
          <FieldsSection title="Incident Information" fields={[["Incident location", report.incidentLocation], ["Relevant dates", report.relevantDates]]} />
          <Section title="Preliminary Summary" content={report.preliminarySummary} />
          <Section title="Immediate Objective" content={report.immediateObjective} />
        </div>
        {hasMaterials && <section className="intake-section intake-attachments"><h2>Attached Materials</h2><div className="intake-attachments__body">
          {photographs.map((photo) => <figure key={photo.id}><div className="intake-photo"><img src={photo.src} alt={photo.alt || photo.caption || "Case supporting photograph"} /></div>{photo.caption && <figcaption>{photo.caption}</figcaption>}</figure>)}
          {materials.length > 0 && <ul>{materials.map((item) => <li key={item.id}>{item.href ? <a href={item.href}>{item.label}</a> : item.label}{item.description && <p>{item.description}</p>}</li>)}</ul>}
        </div></section>}
      </div>
      <Section title="Investigator’s Direction" content={report.investigatorsDirection} className="intake-direction" />
      <footer className="intake-footer"><span>MI Internal Record / Investigator’s Copy{report.caseReference && ` / Case File ${report.caseReference}`}</span>{report.internalFilingReference && <span>Filing reference: {report.internalFilingReference}</span>}</footer>
    </article>
  );
}
