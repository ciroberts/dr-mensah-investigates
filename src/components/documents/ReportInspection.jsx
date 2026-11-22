import { useEffect, useRef } from "react";
import CaseIntakeReport from "./CaseIntakeReport";

export default function ReportInspection({ report, onClose, fromDesk }) {
  const dialog = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const node = dialog.current;
    node.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      node.close();
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus();
    };
  }, []);
  return <dialog ref={dialog} className="report-inspection" aria-labelledby="intake-report-title" onCancel={(event) => { event.preventDefault(); onClose(); }}>
    <div className="report-inspection__toolbar"><span>Mensah Investigations · Case {report.caseReference}</span><button type="button" onClick={onClose} autoFocus>{fromDesk ? "Return to desk" : "Return to organiser"}</button></div>
    <CaseIntakeReport report={report} />
    <div className="report-inspection__end"><button type="button" onClick={onClose}>{fromDesk ? "Return to desk" : "Return to organiser"}</button></div>
  </dialog>;
}
