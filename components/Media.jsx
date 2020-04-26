import Link from "next/link";

export default function Media({ _id, title, season, episode, image }) {
    return (
        <div className="card">
            <div className="card-image">
                <figure className="image">
                    <Link href={"/media/" + _id}>
                        <img src={image} alt="cover" />
                    </Link>
                </figure>
            </div>
            <div className="card-content">
                <div className="media">
                    <div className="media-content">
                        <Link href={"/media/" + _id}>
                            <p className="title is-4">{title}</p>
                        </Link>
                        <p className="subtitle is-6">{season && episode && `S${season}E${episode}`}</p>
                    </div>
                </div>
                <div className="content">
                </div>
            </div>
        </div>
    );
}