const MediaScanner = require("./lib/MediaScanner");
const { createServer } = require("http");
const next = require("next");
const Database = require("./lib/Database");

Database.then(() => {
    const port = parseInt(process.env.PORT, 10) || 3000;
    const dev = process.env.NODE_ENV !== "production";
    const app = next({ dev });
    const handle = app.getRequestHandler();

    app.prepare().then(() => {
        createServer(handle).listen(port, (err) => {
            if (err) throw err;
            console.log(`> Ready on http://localhost:${port}`);
        });
    });

    setTimeout(async () => {
        MediaScanner.Scan();
    }, 500);
});
