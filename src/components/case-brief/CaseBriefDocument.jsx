import CasePhoto from "./CasePhoto";

export default function CaseBriefDocument({ caseData, onBegin }) {
    return (
        <article className="case-paper">

            <div className="case-heading">
                <p className="case-number">
                    CASE {caseData.caseNumber}
                </p>

                <p className="case-title">
                    {caseData.title}
                </p>
            </div>

            <h1 className="classification">
                {caseData.classification}
            </h1>

            <p>{caseData.greeting}</p>

            {caseData.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ))}

            <p className="closing-note">
                {caseData.closingNote}
            </p>

            <div className="mensah-principles">
                {caseData.mensahPrinciples.map((principle, index) => (
                    <p key={index}>{principle}</p>
                ))}
            </div>

            <CasePhoto
                image={caseData.briefPhoto}
                caption={caseData.briefPhotoCaption}
            />

            <p className="signature">
                {caseData.signedBy}
            </p>

            <button
                className="begin-button"
                type="button"
                onClick={onBegin}
            >
                Begin Investigation
            </button>

        </article>
    );
}