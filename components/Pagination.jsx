
export default function ({ page, total, limit, load, className }) {
    const pages = Math.floor(total / limit);
    const items = [];

    items.push(
        <li key={0}>
            <a className={"pagination-link " + (0 === page ? "is-current" : "")} onClick={load.bind(null, 0)}>1</a>
        </li>
    );

    if (page > 3) {
        items.push(
            <li key="spacer-1">
                <span className="pagination-ellipsis">&hellip;</span>
            </li>
        );
    }

    for (let i = Math.max(1, page - 2); i < Math.min(page + 3, pages - 1); i++) {
        items.push(
            <li key={i}>
                <a className={"pagination-link " + (i === page ? "is-current" : "")} onClick={load.bind(null, i)}>{i + 1}</a>
            </li>
        );
    }

    if (page < pages - 3) {
        items.push(
            <li key="spacer-2">
                <span className="pagination-ellipsis">&hellip;</span>
            </li>
        );
    }

    if (pages) {
        items.push(
            <li key={pages}>
                <a className={"pagination-link " + (pages - 1 === page ? "is-current" : "")} onClick={load.bind(null, pages - 1)}>{pages}</a>
            </li>
        );
    }

    return (
        <nav className={className || "pagination is-centered"}>
            <ul className="pagination-list">
                {items}
            </ul>
        </nav>
    );
}