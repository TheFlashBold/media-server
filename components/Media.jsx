import Link from "next/link";
import { renderMeta } from "../lib/Utils";

export default function Media({ _id, title, season, episode, year, image }) {
    return (
        <div className="card">
            {image && (<div className="card-image">
                <figure className="image">
                    <Link href={"/media/" + _id}>
                        <a>
                            <img src={`/api/img/${image}?size=cover-small`} alt="cover" />
                        </a>
                    </Link>
                </figure>
            </div>)}
            <div className="card-content">
                <div className="media">
                    <div className="media-content">
                        <Link href={"/media/" + _id}>
                            <a>
                                <p className="title is-4">{title}</p>
                            </a>
                        </Link>
                        <p className="subtitle is-6">{renderMeta({ season, episode, year })}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}