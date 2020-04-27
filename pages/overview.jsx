import Navigation from "../components/Navigation";
import Media from "../components/Media";
import { useState, useEffect } from "react";
import Head from "next/head";
import axios from "axios";

export default function Home() {
    const [results, setResults] = useState(null);

    useEffect(async () => {
        const { data } = await axios.get('/api/overview');
        setResults(data);
    }, []);

    return (
        <>
            <Head>
                <title>Search</title>
            </Head>
            <Navigation />
            <section className="hero is-dark">
                <div className="hero-body">
                    <div className="container">
                        <h1 className="title">Media-Server</h1>
                        <h2 className="subtitle">Overview</h2>
                    </div>
                </div>
            </section>
            <section className="section">
                <div className="columns is-multiline">
                    {results && results.map((data, index) =>
                        <div key={index} className="column is-one-fifth">
                            <Media {...data} />
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
