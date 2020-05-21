import Authorization from "../components/Authorization";
import Navigation from "../components/Navigation";
import Latest from "../components/Latest";
import Head from "next/head";

export default function Home() {
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
            <Latest />
        </Authorization>
    );
}
