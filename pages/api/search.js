const mongoose = require("mongoose");

export default async (req, res) => {
    let {
        query: { term, page, limit },
    } = req;

    page = parseInt(page) || 0;
    limit = parseInt(limit) || 20;

    const mediaModel = mongoose.model("media");

    const search = new RegExp(term, "i");
    const query = {
        $or: [{ imdbId: search }, { title: search }],
    };
    const results = await mediaModel
        .find(query)
        .skip(page * limit)
        .limit(limit)
        .lean();
    const total = await mediaModel.count(query);

    res.json({
        term,
        page,
        limit,
        results,
        total,
        hasMore: total > (page + 1) * limit,
    });
};
