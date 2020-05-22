import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Pagination from "./Pagination";
import Head from "next/head";
import Media from "./Media";
import axios from "axios";

export default function ({ limit }) {

    const [data, setData] = useState(null);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        id && loadData(0);
    }, [id]);

    const loadData = async (page) => {
        const { data } = await axios.get(`/api/library?libraryId=${id}&limit=${limit}&page=${page}`);
        setData(data);
    }

    return data && (
        <>
            <Head>
                <title>{data.library.title}</title>
            </Head>
            <section className="hero is-dark">
                <div className="hero-body">
                    <div className="container">
                        <h1 className="title">Media-Server</h1>
                        <h2 className="subtitle">{data.library.title}</h2>
                    </div>
                </div>
            </section>
            <section className="section">
                <div className="columns is-multiline is-variable is-1">
                    {data.results && data.results.map((data, index) =>
                        <div key={index} className="column is-2" style={{width: "10%"}}>
                            <Media {...data} />
                        </div>
                    )}
                    <Pagination {...data.pagination} load={loadData} className="pagination is-centered column is-12" />
                </div>
            </section>
        </>
    );
}