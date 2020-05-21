import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Pagination from "./Pagination";
import Media from "./Media";
import axios from "axios";

export default function ({ limit }) {

    const [data, setData] = useState(null);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        id && loadData(0);
    }, [id]);

    const loadData = async (page) => {
        const { data } = await axios.get(`/api/library?libraryId=${id}&limit=${limit}&page=${page}`);
        setData(data);
    }

    return data && (
        <section className="section">
            <div className="columns is-multiline">
                {data.results && data.results.map((data, index) =>
                    <div key={index} className="column is-one-fifth">
                        <Media {...data} />
                    </div>
                )}
                <Pagination {...data.pagination} load={loadData} className="pagination is-centered column is-12" />
            </div>
        </section>
    );
}