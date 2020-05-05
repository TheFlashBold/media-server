const request = require("request-promise");
const { exec } = require("child_process");
const ffmpeg = require("fluent-ffmpeg");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const gm = require("gm");

const Sizes = require("../../../config/imageSizes.json");
const CachePath = path.resolve(process.cwd(), ".cache");

const schema = new mongoose.Schema({
    source: {
        type: String,
        enum: ["file", "http"],
    },
    uri: {
        type: String,
    },
});

schema.virtual("filepath").get(function () {
    return path.resolve(
        CachePath,
        this._id.toString().replace(/[^a-z0-9]/g, "")
    );
});

schema.methods.generate = async function () {
    if (fs.existsSync(this.filepath)) {
        return;
    }

    if (this.source === "http") {
        const data = await request({
            uri: this.uri,
            encoding: null,
        });
        fs.writeFileSync(this.filepath, data);
    } else if (this.source === "file") {
        await new Promise((resolve) => {
            ffmpeg(this.uri)
                .inputOption("-ss 00:02:00")
                .outputOption("-vframes 1")
                .toFormat("image2")
                .output(this.filepath)
                .on("end", resolve)
                .run();
        });
    }
};

schema.methods.getSize = async function (size) {
    await this.generate();

    if (size) {
        await this.resize(size);
        return fs.createReadStream(this.filepath + "_" + size);
    }

    return fs.createReadStream(this.filepath);
};

schema.methods.resize = async function (size) {
    if (!Sizes[size] || fs.existsSync(this.filepath + "_" + size)) {
        return;
    }

    const { width, height } = Sizes[size];

    return new Promise((resolve, reject) => {
        gm(this.filepath)
            .resize(width, height)
            .noProfile()
            .write(
                this.filepath + "_" + size,
                (err) => (err && reject(err)) || resolve()
            );
    });
};

schema.methods.getMimeType = async function () {
    return new Promise((resolve, reject) => {
        exec(`file -b --mime-type "${this.filepath}"`, (err, stdout) => {
            if (err) {
                return reject(err);
            }
            resolve(stdout.replace(/[\\r\\n]/, "").trim());
        });
    });
};

mongoose.model("image", schema);
