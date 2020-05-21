import { useEffect, useState } from "react";
import Media from "./Media";
import axios from "axios";

export default function () {
    const [latest, setLatest] = useState(null);

    useEffect(() => {
        axios.get("/api/latest")
            .then(({ data }) => setLatest(data))
            .catch(console.error);
    }, []);

    return latest && (
        <section className="section">
            <h2 className="subtitle">Recently added</h2>
            <div className="columns is-multiline">
                {latest && latest.map((data, index) =>
                    <div key={index} className="column is-one-fifth">
                        <Media {...data} />
                    </div>
                )}
            </div>
        </section>
    );
}