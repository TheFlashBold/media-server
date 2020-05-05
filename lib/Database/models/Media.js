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
    image: {
        type: String,
    },
    library: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "library"
    },
    _createdAt: {
        type: Date,
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
        title: this.title,
        season: this.season,
        episode: this.episode,
        year: this.year,
        next: await this.getNext(),
        prev: await this.getPrev(),
    };
};

schema.methods.getNext = async function () {
    return (
        this.episode &&
        this.season &&
        (await mediaModel.findOne({
            imdbId: this.imdbId,
            $or: [
                {
                    season: this.season,
                    episode: this.episode + 1,
                },
                {
                    season: this.season + 1,
                    episode: 1,
                },
            ],
        }))
    );
};

schema.methods.getPrev = async function () {
    return (
        this.episode &&
        this.season &&
        (
            await mediaModel
                .find({
                    imdbId: this.imdbId,
                    $or: [
                        {
                            season: this.season,
                            episode: this.episode - 1,
                        },
                        {
                            season: this.season - 1,
                        },
                    ],
                })
                .sort({ episode: -1 })
                .limit(1)
        )[0]
    );
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

const mediaModel = mongoose.model("media", schema);
