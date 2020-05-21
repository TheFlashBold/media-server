import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

export default function () {

    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get(`/api/libraries`).then(({ data }) => setData(data));
    }, []);

    return data && (
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
    )
}