import VideoPlayer from "../../components/VideoPlayer";
import Navigation from "../../components/Navigation";
import { renderMeta } from "../../lib/Utils";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
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
                        <h1 className="title has-text-centered">{meta.title}</h1>
                        <nav className="level">
                            {meta.prev && (
                                <p className="level-item has-text-centered">
                                    <Link href={`/media/${meta.prev._id}`}>
                                        <a className="link is-info" >
                                            {renderMeta(meta.prev)}
                                        </a>
                                    </Link>
                                </p>
                            )}
                            <p className="level-item has-text-centered">
                                {renderMeta(meta)}
                            </p>
                            {meta.next && (
                                <p className="level-item has-text-centered">
                                    <Link href={`/media/${meta.next._id}`}>
                                        <a className="link is-info">
                                            {renderMeta(meta.next)}
                                        </a>
                                    </Link>
                                </p>
                            )}
                        </nav>
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
