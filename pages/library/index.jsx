import Navigation from "../../components/Navigation";
import Authorization from "../../components/Authorization";
import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import axios from "axios";

export default function Home() {
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get(`/api/libraries`).then(({ data }) => setData(data));
    }, []);

    return data && (
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
            <section className="section">
                <div className="columns is-multiline">
                    <table className="table is-fullwidth">
                        <tbody>
                            {data.map(({ _id, title }, index) =>
                                <tr key={index}>
                                    <td className="has-text-centered">
                                        <Link href={"/library/" + _id}>
                                            <a>
                                                {title}
                                            </a>
                                        </Link>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </Authorization>
    );
}
