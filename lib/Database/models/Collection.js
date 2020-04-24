const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    title: {
        type: String,
    },
    media: [
        {
            type: mongoose.Types.ObjectId,
            ref: "media",
        },
    ],
    year: {
        type: Number,
    },
    imdbId: {
        type: String,
    },
    image: {
        type: String,
    }
});

mongoose.model("collection", schema);
