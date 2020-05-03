import Navigation from "../components/Navigation";
import Pagination from "../components/Pagination";
import Media from "../components/Media";
import { useState } from "react";
import Head from "next/head";
import axios from "axios";

const LIMIT = 10;

export default function Home() {
    const [data, setData] = useState(null);
    const [term, setTerm] = useState("");

    const loadData = async (page) => {
        const { data } = await axios.get(`/api/search?term=${encodeURI(term)}&limit=${LIMIT}&page=${page}`)
        setData(data);
    };

    const onSearchChange = ({ target }) => {
        setTerm(target.value);
    }

    const onSearch = () => {
        loadData(0);
    };

    const onLoadMore = () => {
        loadData(page + 1);
    };

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
                        <h2 className="subtitle">Search</h2>
                    </div>
                </div>
            </section>
            <section className="section">
                <div class="field has-addons is-fullwidth">
                    <div class="control">
                        <input class="input" type="text" placeholder="search..." value={term} onChange={onSearchChange} onKeyDown={({ keyCode }) => keyCode === 13 && onSearch()} />
                    </div>
                    <div class="control">
                        <button class="button is-info" onClick={onSearch}>search</button>
                    </div>
                </div>
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
