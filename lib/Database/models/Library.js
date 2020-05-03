const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    title: {
        type: String,
    },
    type: {
        type: String,
        enum: ["movies", "series"],
    },
    path: {
        type: String,
    },
});

mongoose.model("library", schema);
