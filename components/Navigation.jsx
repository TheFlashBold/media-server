import Link from "next/link";

export default function Navigation(props) {

    return (
        <nav className="navbar" role="navigation" aria-label="main navigation">
            <div className="navbar-menu">
                <div className="navbar-start">
                    <Link href="/">
                        <a className="navbar-item">Home</a>
                    </Link>
                    <Link href="/search">
                        <a className="navbar-item">Search</a>
                    </Link>
                    <Link href="/overview">
                        <a className="navbar-item">Overview</a>
                    </Link>
                </div>
            </div>
        </nav>
    )
}