const mongoose = require("mongoose");

export default async (req, res) => {
    let {
        query: { term, page, limit },
    } = req;

    page = page || 0;
    limit = limit || 20;

    const mediaModel = mongoose.model("media");

    const search = new RegExp(query, "i");
    const results = await mediaModel
        .find({ imdbId: search, title: search })
        .skip(page * limit)
        .limit(limit)
        .lean();

    res.json({
        term,
        page,
        limit,
        results,
    });
};
