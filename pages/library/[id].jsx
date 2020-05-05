import Navigation from "../../components/Navigation";
import Pagination from "../../components/Pagination";
import Media from "../../components/Media";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import axios from "axios";

const LIMIT = 20;

export default function Home() {
    const [data, setData] = useState(null);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        id && loadData(0);
    }, [id]);

    const loadData = async (page) => {
        const { data } = await axios.get(`/api/library?libraryId=${id}&limit=${LIMIT}&page=${page}`);
        setData(data);
    }

    return data && (
        <>
            <Head>
                <title>{data.library.title}</title>
            </Head>
            <Navigation />
            <section className="hero is-dark">
                <div className="hero-body">
                    <div className="container">
                        <h1 className="title">Media-Server</h1>
                        <h2 className="subtitle">{data.library.title}</h2>
                    </div>
                </div>
            </section>
            <section className="section">
                <div className="columns is-multiline">
                    {data.results && data.results.map((data, index) =>
                        <div key={index} className="column is-one-fifth">
                            <Media {...data} />
                        </div>
                    )}
                    <Pagination {...data.pagination} load={loadData} className="pagination is-centered column is-12" />
                </div>
            </section>
        </>
    );
}
