import Authorization from "../components/Authorization";
import Navigation from "../components/Navigation";
import Search from "../components/Search";
import Head from "next/head";

export default function () {
    return (
        <Authorization>
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
            <Search limit={20} />
        </Authorization>
    );
}
