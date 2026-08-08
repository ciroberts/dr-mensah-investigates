export default function CasePhoto({ image, caption }) {
    return (
        <div className="case-photo">
            <img
                src={image}
                alt={caption}
            />

            <div className="photo-caption">
                {caption}
            </div>
        </div>
    );
}