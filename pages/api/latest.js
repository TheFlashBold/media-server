const mongoose = require("mongoose");
const { getUser } = require("../../lib/Auth");

export default async (req, res) => {
    if (!(await getUser(req, res))) return;

    const {
        query: { limit },
    } = req;
    const mediaModel = mongoose.model("media");

    const results = await mediaModel
        .find()
        .sort({ _createdAt: -1 })
        .limit(limit || 5)
        .lean();

    res.json(results);
};
