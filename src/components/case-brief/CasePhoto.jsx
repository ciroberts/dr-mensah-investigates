export default function CasePhoto({ image, caption }) {
    return (
        <div className="case-photo">

            <div className="photo-image">
                <img
                    src={image}
                    alt={caption}
                />
            </div>

            <div className="photo-caption">
                {caption}
            </div>

        </div>
    );
}