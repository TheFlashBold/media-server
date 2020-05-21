const { getUser } = require("../../lib/Auth");
const mongoose = require("mongoose");

export default async (req, res) => {
    if (!(await getUser(req, res))) return;

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
        .sort({ title: 1, season: 1, episode: 1 })
        .skip(page * limit)
        .limit(limit)
        .lean();
    const total = await mediaModel.count(query);

    res.json({
        term,
        results,
        pagination: {
            page,
            limit,
            total
        },
    });
};
