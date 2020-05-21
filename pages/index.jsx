import Authorization from "../components/Authorization";
import Navigation from "../components/Navigation";
import { useEffect, useState } from "react";
import Media from "../components/Media";
import Head from "next/head";
import axios from "axios";

export default function Home() {
    const [latest, setLatest] = useState(null);

    useEffect(() => {
        axios.get("/api/latest")
            .then(({ data }) => setLatest(data))
            .catch(console.error);
    }, []);

    return (
        <Authorization>
            <Head>
                <title>Media-Server</title>
            </Head>
            <Navigation />
            <section className="hero is-dark">
                <div className="hero-body">
                    <div className="container">
                        <h1 className="title">Media-Server</h1>
                        <h2 className="subtitle"></h2>
                    </div>
                </div>
            </section>
            <section className="section">
                <h2 className="subtitle">Recently added</h2>
                <div className="columns is-multiline">
                    {latest && latest.map((data, index) =>
                        <div key={index} className="column is-one-fifth">
                            <Media {...data} />
                        </div>
                    )}
                </div>
            </section>
        </Authorization>
    );
}
