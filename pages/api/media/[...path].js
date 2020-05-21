const presets = require("../../../config/presets.json");
const { getUser } = require("../../lib/Auth");
const ffmpeg = require("fluent-ffmpeg");
const mongoose = require("mongoose");
const send = require("send");

async function streamFile(req, res, media) {
    res.setHeader("Content-Length", media.getStats().size);
    res.setHeader("Content-Type", await media.getMimeType());

    const stream = send(req, media.get("file"));
    stream.pipe(res);

    return new Promise((resolve) => {
        stream.on("end", resolve);
        stream.on("error", resolve);
    });
}

async function transcodeFile(res, media, preset, seek) {
    if (!presets[preset] || res.method === "HEAD") {
        return res.status(404);
    }

    const {
        inputOptions,
        videoCodec,
        videoBitrate,
        audioBitrate,
        audioChannels,
        size,
        outputOptions,
        toFormat,
    } = presets[preset];

    const stream = ffmpeg(media.get("file"));

    seek && stream.seekInput(seek);
    inputOptions && stream.inputOptions(inputOptions);
    videoCodec && stream.videoCodec(videoCodec);
    videoBitrate && stream.videoBitrate(videoBitrate, true);
    audioBitrate && stream.audioBitrate(audioBitrate, true);
    audioChannels && stream.audioChannels(audioChannels);
    size && stream.size(size);
    outputOptions && stream.outputOptions(outputOptions);
    toFormat && stream.toFormat(toFormat);

    stream.on("start", (cmd) => {
        console.log("starting transcode:", cmd);
    });

    return new Promise((resolve) => {
        stream.on("end", resolve);
        stream.on("error", (err) => {
            console.error(err);
            resolve();
        });

        stream.pipe(res, { end: true });
    });
}

export default async (req, res) => {
    if (!(await getUser(req, res))) return;

    const {
        query: {
            path: [id, preset],
            meta,
            seek,
        },
    } = req;

    const media = await mongoose.model("media").findOne({ _id: id });
    if (!media) {
        return res.json({ error: "Not found" }).status(404);
    }

    if (typeof meta !== "undefined") {
        return res.json(await media.getMeta());
    }

    if (!preset) {
        return streamFile(req, res, media);
    }

    return transcodeFile(res, media, preset, seek);
};
