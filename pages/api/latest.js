const mongoose = require("mongoose");

export default async (req, res) => {
    const {
        query: { limit },
    } = req;
    const mediaModel = mongoose.model("media");

    const results = await mediaModel
        .find()
        .sort({ _createdAt: -1 })
        .limit(limit || 20)
        .lean();

    res.json(results);
};
