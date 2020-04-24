import Plyr from "react-plyr";

export default function Media(props) {
    return (
        <section className="section">
            <div className="container">
                <Plyr
                    type="video"
                    sources={[
                        {
                            src: "/api/media/5ea3092212e5c03354a2f31d",
                            type: "video/mp4",
                        },
                    ]}
                />
            </div>
        </section>
    );
}
