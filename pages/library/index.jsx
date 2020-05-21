import Authorization from "../../components/Authorization";
import Navigation from "../../components/Navigation";
import Libraries from "../../components/Libraries";
import Head from "next/head";

export default function () {
    return (
        <Authorization>
            <Head>
                <title>Libraries</title>
            </Head>
            <Navigation />
            <section className="hero is-dark">
                <div className="hero-body">
                    <div className="container">
                        <h1 className="title">Media-Server</h1>
                        <h2 className="subtitle">Libraries</h2>
                    </div>
                </div>
            </section>
            <Libraries />
        </Authorization>
    );
}
