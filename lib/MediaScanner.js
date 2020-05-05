const request = require("request-promise");
const mongoose = require("mongoose");
const readdirp = require("readdirp");
const Promise = require("bluebird");

const MOVIE_REGEX = /(?<movie>.*?)(?:[\{\(\[]?(?<year>[0-9]{4})[^p]).*/;
const SERIES_REGEX = /(?<series>.*?)[s](?<season>[0-9]+)[._ ]*[e](?<episode>[0-9]+)[._ ]*([- ]?[s](?<secondSeason>[0-9]+))?([- ]?[e+](?<secondEpisode>[0-9]+))?/i;

const EXTENSIONS = ["mp4", "mkv", "webm", "avi", "flv"];

function MediaScanner() {}

MediaScanner.Scan = async () => {
    const libs = await mongoose.model("library").find({});
    return Promise.map(libs, MediaScanner.ScanLibrary, { concurrency: 2 });
};

MediaScanner.ScanLibrary = async (lib) => {
    console.log("scanning library", lib.title);
    for await (const file of readdirp(lib.path)) {
        if (file.basename.indexOf(".") === -1) {
            continue;
        }
        const [, ext] = /\.(.*?)$/.exec(file.basename);
        if (!EXTENSIONS.includes(ext.toLowerCase())) {
            continue;
        }

        await MediaScanner.ScanFile(lib, file);
    }
};

MediaScanner.ScanFile = async (lib, file) => {
    const mediaModel = mongoose.model("media");
    if (await mediaModel.findOne({ file: file.fullPath }).lean()) {
        return;
    }

    switch (lib.type) {
        case "videos":
            return MediaScanner.ScanGeneric(lib, file);
        case "movies":
            return MediaScanner.ScanMovie(lib, file);
        case "series":
            return MediaScanner.ScanSeries(lib, file);
    }
};

MediaScanner.ScanMovie = async (lib, { fullPath, basename }) => {
    if (!MOVIE_REGEX.test(basename)) {
        return;
    }

    const {
        groups: { movie, year },
    } = basename.match(MOVIE_REGEX);

    const data = await MediaScanner.LookupTitle(movie);

    if (!data) {
        return;
    }

    const mediaModel = mongoose.model("media");

    console.log("scanned", data.title);

    const media = new mediaModel({
        title: data.title,
        imdbId: data.imdbId,
        file: fullPath,
        year: year || data.year,
        image: data.image && (await MediaScanner.AddImage(data.image)),
        library: lib._id,
        _createdAt: new Date(),
    });
    await media.save();
};

MediaScanner.ScanSeries = async (lib, { fullPath, basename }) => {
    if (!SERIES_REGEX.test(basename)) {
        return;
    }

    const {
        groups: { series, season, episode },
    } = basename.match(SERIES_REGEX);

    const data = await MediaScanner.LookupTitle(series);

    if (!data) {
        return;
    }

    const mediaModel = mongoose.model("media");

    console.log("scanned", data.title, "S" + season, "E" + episode);

    const media = new mediaModel({
        title: data.title,
        imdbId: data.imdbId,
        file: fullPath,
        season,
        episode,
        year: data.year,
        image: data.image && (await MediaScanner.AddImage(data.image)),
        library: lib._id,
        _createdAt: new Date(),
    });
    await media.save();
};

MediaScanner.ScanGeneric = async (lib, { fullPath, basename }) => {
    const mediaModel = mongoose.model("media");

    const [, title] = /^(.*)\.(?:.*?)$/.exec(basename);

    console.log("scanned", title);

    const media = new mediaModel({
        title,
        file: fullPath,
        image: await MediaScanner.AddImage(null, fullPath),
        library: lib._id,
        _createdAt: new Date(),
    });
    await media.save();
};

MediaScanner.AddImage = async (url, file) => {
    const imageModel = mongoose.model("image");
    let image = await imageModel.findOne({ source: url });

    if (image) {
        return image._id;
    }

    image = new imageModel({
        source: "http",
        uri: url || file,
    });
    await image.save();
    return image._id;
};

MediaScanner.LookupTitle = async (title) => {
    const sanitizedTitle = title
        .trim()
        .replace(/[^a-z0-9]+/gi, "_")
        .toLowerCase();

    if (!sanitizedTitle.length) {
        return null;
    }

    const { d: matches } = await request({
        url: `https://v2.sg.media-imdb.com/suggestion/${sanitizedTitle[0]}/${sanitizedTitle}.json`,
        json: true,
    });

    if (typeof matches === "undefined") {
        return null;
    }

    const [{ id, i: image, l: realTitle, q: type, y: year }] = matches;

    if (!["TV series", "feature"].includes(type)) {
        return null;
    }

    return {
        imdbId: id,
        title: realTitle,
        year,
        image: (image && image.imageUrl) || null,
    };
};

module.exports = MediaScanner;
