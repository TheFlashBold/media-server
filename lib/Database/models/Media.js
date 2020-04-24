const { exec } = require("child_process");
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
});

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
