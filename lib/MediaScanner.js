const request = require("request-promise");
const mongoose = require("mongoose");
const readdirp = require("readdirp");
const Promise = require("bluebird");

const Libraries = require("../config/libraries.json");

const MOVIE_REGEX = /(?<movie>.*?)(?<year>[0-9]{4})?/;
const SERIES_REGEX = /(?<show>.*?)[s](?<season>[0-9]+)[._ ]*[e](?<episode>[0-9]+)[._ ]*([- ]?[s](?<secondSeason>[0-9]+))?([- ]?[e+](?<secondEpisode>[0-9]+))?/i;

function MediaScanner() {}

MediaScanner.Scan = async () => {
    return Promise.map(Libraries, MediaScanner.ScanLibrary, { concurrency: 2 });
};

MediaScanner.ScanLibrary = async (lib) => {
    console.log("scanning library", lib.title);
    for await (const file of readdirp(lib.path)) {
        await MediaScanner.ScanFile(lib, file);
    }
};

MediaScanner.ScanFile = async (lib, file) => {
    const mediaModel = mongoose.model("media");
    if (await mediaModel.findOne({ file: file.fullPath }).lean()) {
        return;
    }

    switch (lib.type) {
        case "movies":
        // return MediaScanner.ScanMovie(lib, file);
        case "series":
            return MediaScanner.ScanSeries(lib, file);
    }
};

MediaScanner.ScanSeries = async (lib, { fullPath, basename }) => {
    if (!SERIES_REGEX.test(basename)) {
        return;
    }

    const {
        groups: { show, season, episode },
    } = basename.match(SERIES_REGEX);

    const data = await MediaScanner.LookupTitle(show);

    if (!data) {
        return;
    }

    const mediaModel = mongoose.model("media");

    console.log("scanned", data.title);

    const media = new mediaModel({
        title: data.title,
        imdbId: data.imdbId,
        file: fullPath,
        season,
        episode,
    });
    await media.save();
};

MediaScanner.LookupTitle = async (title) => {
    const sanitizedTitle = title
        .trim()
        .replace(/[^a-z0-9]+/gi, "_")
        .toLowerCase();

    const { d: matches } = await request({
        url: `https://v2.sg.media-imdb.com/suggestion/${sanitizedTitle[0]}/${sanitizedTitle}.json`,
        json: true,
    });

    if (typeof matches === "undefined") {
        return null;
    }

    const [{ id, i: image, l: realTitle, q: type, y: year }] = matches;

    return {
        imdbId: id,
        title: realTitle,
        year,
        image: (image && image.imageUrl) || null,
    };
};

module.exports = MediaScanner;
