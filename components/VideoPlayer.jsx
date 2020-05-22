import { useState } from "react";
import { formatSeconds } from "../lib/Utils";
import styles from "./VideoPlayer.module.css"

export default function VideoPlayer({ streams, duration }) {
    const [stream, setStream] = useState(0);
    const [offset, setOffset] = useState(0);
    const [time, setTime] = useState(0);
    const [volume, setVolume] = useState(1);
    const [video, setVideo] = useState(null);

    const seek = (pos) => {
        if (stream === 0) {
            setTime(pos);
            setOffset(0);
            video.currentTime = pos;
        } else {
            setTime(0);
            setOffset(pos);
            video.src = streams[stream].src + `?seek=${pos}`;
        }
    };

    const onToggle = () => {
        !video.paused ? video.pause() : video.play();
    };

    const onStreamChange = ({ target }) => {
        if (stream !== 0 && target.value === 0) {
            setTime(offset + time);
            setOffset(0);
        }
        setStream(target.value);
    };

    const onVolumeChange = ({ target }) => {
        video.volume = target.value;
        setVolume(target.value);
    };

    return (
        <>
            <video
                style={{ width: "100%", height: "auto" }}
                ref={setVideo}
                src={streams[stream].src}
                onTimeUpdate={({ target }) => setTime(target.currentTime)}
            />
            <div className="columns" style={{ marginTop: "-58px", position: "relative" }}>
                <div className="column is-1">
                    <button className="button is-small" onClick={onToggle}>play/pause</button>
                </div>
                <input
                    className="slider is-small column is-6"
                    value={offset + time}
                    type="range"
                    min={0}
                    max={duration}
                    onChange={({ target }) => seek(parseFloat(target.value))}
                />
                <div className="column is-5 columns is-desktop is-vcentered">
                    <button className="collumn button is-small" onClick={() => seek(offset + time - 10)}>-10s</button>
                    <button className="collumn button is-small" onClick={() => seek(offset + time + 30)}>+30s</button>
                    <span className="collumn subtitle" style={{ paddingTop: "23px" }}>{formatSeconds(offset + time)} - {formatSeconds(duration)}</span>
                    <input className={styles.volumeSlider + "slider is-small"}
                        value={volume}
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        onChange={onVolumeChange}
                    />
                    <div className="select is-small collumn">
                        <select value={stream} onChange={onStreamChange}>
                            {streams.map(({ label }, key) =>
                                <option key={key} value={key}>{label}</option>
                            )}
                        </select>
                    </div>
                </div>
            </div>
        </>
    )
}