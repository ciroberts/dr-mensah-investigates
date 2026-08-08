import CasePhoto from "./CasePhoto";

export default function CaseBriefDocument({ caseData }) {
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

            <p className="recommendation">
                {caseData.recommendation}
            </p>

            <div className="mensah-instructions">
                {caseData.instructions.map((instruction, index) => (
                    <p key={index}>{instruction}</p>
                ))}
            </div>

            <CasePhoto
                image={caseData.briefPhoto}
                caption={caseData.briefPhotoCaption}
            />

            <p className="signature">
                {caseData.signedBy}
            </p>

            <button className="begin-button">
                Begin Investigation
            </button>

        </article>
    );
}