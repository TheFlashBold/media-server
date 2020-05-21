import { parseCookies, setCookie, destroyCookie } from 'nookies';
import styles from "./Authorization.module.css";
import { useState } from "react";
import Head from "next/head";
import axios from "axios";

function renderLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const onLogin = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const { data: { token, error } } = await axios.post("/api/login", { username, password });

        token && setCookie(null, 'Authorization', token, {
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
        }) && window.location.reload();
        error && setError(error);
    };

    return (
        <>
            <Head>
                <title>Media-Server login</title>
            </Head>
            <section className="columns hero is-medium">
                <div className="column is-half is-offset-one-quarter">
                    <nav className="panel">
                        <div className={styles.panel}>
                            <h1 className="title">Login</h1>
                            <form onSubmit={onLogin}>
                                <div className="field is-horizontal">
                                    <div className="field-label is-normal">
                                        <label className="label">username</label>
                                    </div>
                                    <div className="field-body">
                                        <div className="field">
                                            <p className="control">
                                                <input value={username} onChange={({ target: { value } }) => setUsername(value)} className="input" type="text" placeholder="username" name="username" />
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="field is-horizontal">
                                    <div className="field-label is-normal">
                                        <label className="label">password</label>
                                    </div>
                                    <div className="field-body">
                                        <div className="field">
                                            <p className="control">
                                                <input value={password} onChange={({ target: { value } }) => setPassword(value)} className="input" type="password" placeholder="password" name="password" />
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="field is-grouped">
                                    <div className="control">
                                        <button className="button is-link" type="submit">login</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </nav>
                </div>
            </section>
        </>
    );
}

export default function ({ children }) {
    const { Authorization } = parseCookies();

    if (Authorization) return children;

    return renderLogin();
}