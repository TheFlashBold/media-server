import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

function formatSeconds(value) {
    const seconds = value % 60;
    const minutes = Math.floor(value / 60);

    return `${minutes.toFixed(0)}:${seconds.toFixed(0)}`;
}

let video;

export default function Media(props) {
    const router = useRouter();
    const { id } = router.query;
    const [meta, setMeta] = useState(null);
    const [stream, setStream] = useState(0);
    const [time, setTime] = useState(0);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        id && axios.get(`/api/media/${id}?meta`)
            .then(({ data }) => setMeta(data))
            .catch(console.error);
    }, [id]);

    const seek = (pos) => {
        if (stream === 0) {
            setTime(pos);
            setOffset(0);
            video.currentTime = pos;
        } else {
            setTime(0);
            setOffset(pos);
            const [src] = video.src.split("?");
            video.src = src + `?seek=${pos}`;
        }
    };

    return meta && (
        <section className="section">
            <div className="container">
                <video ref={c => video = c} style={{ width: "100%", height: "auto" }} src={meta.streams[stream].src} controls onTimeUpdate={({ target }) => setTime(target.currentTime)} />
                <div className="columns">
                    <input className="slider is-small column is-9" value={offset + time} type="range" min={0} max={meta.duration} onChange={({ target }) => seek(parseFloat(target.value))} />
                    <div className="column is-3">
                        <button className="button is-small" onClick={() => seek(offset + time - 10)}>-10s</button>
                        <button className="button is-small" onClick={() => seek(offset + time + 30)}>+30s</button>
                        <span className="subtitle">{formatSeconds(offset + time)} - {formatSeconds(meta.duration)}</span>
                        <div className="select is-small">
                            <select value={stream} onChange={({ target }) => setStream(target.value)}>
                                {meta.streams.map(({ label }, key) =>
                                    <option key={key} value={key}>{label}</option>
                                )}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
