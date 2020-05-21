import Authorization from "../../components/Authorization";
import Navigation from "../../components/Navigation";
import Head from "next/head";
import Library from "../../components/Library";

export default function Home() {

    return (
        <Authorization>
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
            <Library limit={20} />
        </Authorization>
    );
}
