import Navigation from "../components/Navigation";
import Pagination from "../components/Pagination";
import Media from "../components/Media";
import { useState, useEffect } from "react";
import Head from "next/head";
import axios from "axios";

const LIMIT = 20;

export default function Home() {
    const [data, setData] = useState(null);

    useEffect(() => {
        loadData(0);
    }, []);

    const loadData = async (page) => {
        const { data } = await axios.get(`/api/overview?limit=${LIMIT}&page=${page}`);
        setData(data);
    }

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
                    {data && (
                        <>
                            {data.results && data.results.map((data, index) =>
                                <div key={index} className="column is-one-fifth">
                                    <Media {...data} />
                                </div>
                            )}
                            <Pagination {...data.pagination} load={loadData} className="pagination is-centered column is-12"/>
                        </>
                    )}
                </div>
            </section>
        </>
    );
}
