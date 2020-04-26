import Link from "next/link";
import { formatSeriesInfo } from "../lib/Utils";

export default function Media({ _id, title, season, episode, image }) {
    return (
        <div className="card">
            <div className="card-image">
                <figure className="image">
                    <Link href={"/media/" + _id}>
                        <a>
                            <img src={image} alt="cover" />
                        </a>
                    </Link>
                </figure>
            </div>
            <div className="card-content">
                <div className="media">
                    <div className="media-content">
                        <Link href={"/media/" + _id}>
                            <a>
                                <p className="title is-4">{title}</p>
                            </a>
                        </Link>
                        <p className="subtitle is-6">{season && episode && formatSeriesInfo(season, episode)}</p>
                    </div>
                </div>
                <div className="content">
                </div>
            </div>
        </div>
    );
}