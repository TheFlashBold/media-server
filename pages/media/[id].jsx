import VideoPlayer from "../../components/VideoPlayer";
import Navigation from "../../components/Navigation";
import { renderMeta } from "../../lib/Utils";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function Media(props) {
    const router = useRouter();
    const { id } = router.query;
    const [meta, setMeta] = useState(null);

    useEffect(() => {
        id && axios.get(`/api/media/${id}?meta`)
            .then(({ data }) => setMeta(data))
            .catch(console.error);
    }, [id]);

    return meta && (
        <>
            <Navigation />
            <section className="hero is-dark">
                <div className="hero-body">
                    <div className="container">
                        <h1 className="title">{meta.title}</h1>
                        <h2 className="subtitle">{renderMeta(meta)}</h2>
                    </div>
                </div>
            </section>
            <section className="section">
                <div className="container">
                    <VideoPlayer {...meta} />
                </div>
            </section>
        </>
    );
}
