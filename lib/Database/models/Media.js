const presets = require("../../../config/presets.json");
const { exec } = require("child_process");
const ffmpeg = require("fluent-ffmpeg");
const mongoose = require("mongoose");
const fs = require("fs");

const schema = new mongoose.Schema({
    title: {
        type: String,
    },
    imdbId: {
        type: String,
    },
    file: {
        type: String,
    },
    season: {
        type: Number,
    },
    episode: {
        type: Number,
    },
    year: {
        type: Number,
    },
});

schema.methods.getMeta = async function () {
    const {
        streams: fileStreams,
        format: { duration },
    } = await this.probe();

    const videoStream = fileStreams.find(({ height }) => !!height);

    const streams = [
        {
            src: `/api/media/${this._id}`,
            type: await this.getMimeType(),
            label: "original",
        },
    ];

    for (const [preset, { toFormat, height }] of Object.entries(presets)) {
        if (height && height > videoStream.height) {
            continue;
        }
        streams.push({
            src: `/api/media/${this._id}/${preset}`,
            type: `video/${toFormat}`,
            label: preset,
        });
    }

    return {
        duration,
        streams,
    };
};

schema.methods.probe = async function () {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(this.file, function (err, metadata) {
            if (err) {
                return reject(err);
            }

            resolve(metadata);
        });
    });
};

schema.methods.getMimeType = async function () {
    return new Promise((resolve, reject) => {
        exec(`file -b --mime-type "${this.file}"`, (err, stdout) => {
            if (err) {
                return reject(err);
            }
            resolve(stdout.replace(/[\\r\\n]/, "").trim());
        });
    });
};

schema.methods.getStats = function () {
    return fs.statSync(this.get("file"));
};

mongoose.model("media", schema);
