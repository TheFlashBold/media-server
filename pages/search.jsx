import Navigation from "../components/Navigation";
import Media from "../components/Media";
import { useState } from "react";
import Head from "next/head";
import axios from "axios";

const LIMIT = 10;

export default function Home() {
    const [results, setResults] = useState(null);
    const [term, setTerm] = useState("");
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);

    const search = async (page) => {
        const { data: { results: newResults, page: newPage, hasMore } } = await axios.get(`/api/search?term=${encodeURI(term)}&limit=${LIMIT}&page=${page}`)
        setResults(!page ? newResults : results.concat(newResults));
        setPage(newPage);
        setHasMore(hasMore);
    };

    const onSearchChange = ({ target }) => {
        setTerm(target.value);
    }

    const onSearch = () => {
        search(0);
    };

    const onLoadMore = () => {
        search(page + 1);
    };

    return (
        <>
            <Head>
                <title>Search</title>
            </Head>
            <Navigation/>
            <section className="hero is-dark">
                <div className="hero-body">
                    <div className="container">
                        <h1 className="title">Media-Server</h1>
                        <h2 className="subtitle"></h2>
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
                    {results && results.map((data, index) =>
                        <div key={index} className="column is-one-fifth">
                            <Media {...data} />
                        </div>
                    )}
                    {hasMore && (
                        <nav className="level column is-12">
                            <p className="level-item has-text-centered">
                                <a onClick={onLoadMore}>load more</a>
                            </p>
                        </nav>
                    )}
                </div>
            </section>
        </>
    );
}
