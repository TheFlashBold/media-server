import Pagination from "./Pagination";
import { useState } from "react";
import Media from "./Media";
import axios from "axios";

export default function ({ limit }) {
    const [data, setData] = useState(null);
    const [term, setTerm] = useState("");

    const loadData = async (page) => {
        const { data } = await axios.get(`/api/search?term=${encodeURI(term)}&limit=${limit}&page=${page}`)
        setData(data);
    };

    const onSearchChange = ({ target }) => {
        setTerm(target.value);
    }

    const onSearch = () => {
        loadData(0);
    };

    return (
        <section className="section">
            <div className="field has-addons is-fullwidth">
                <div className="control">
                    <input className="input" type="text" placeholder="search..." value={term} onChange={onSearchChange} onKeyDown={({ keyCode }) => keyCode === 13 && onSearch()} />
                </div>
                <div className="control">
                    <button className="button is-info" onClick={onSearch}>search</button>
                </div>
            </div>
            <div className="columns is-multiline">
                {data && (
                    <>
                        {data.results && data.results.map((data, index) =>
                            <div key={index} className="column is-one-fifth">
                                <Media {...data} />
                            </div>
                        )}
                        <Pagination {...data.pagination} load={loadData} className="pagination is-centered column is-12" />
                    </>
                )}
            </div>
        </section>
    );
}