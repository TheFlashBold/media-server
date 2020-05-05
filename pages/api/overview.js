const mongoose = require("mongoose");

export default async (req, res) => {
    let {
        query: { limit, page },
    } = req;
    const mediaModel = mongoose.model("media");

    limit = parseInt(limit) || 20;
    page = parseInt(page) || 0;

    const results = await mediaModel.aggregate([
        {
            $sort: { title: 1, season: 1, episode: 1 },
        },
        {
            $group: {
                _id: "$title",
                id: { $first: "$_id" },
                title: { $first: "$title" },
                image: { $first: "$image" },
                year: { $first: "$year" },
                media: {
                    $push: {
                        episode: "$episode",
                        season: "$season",
                        image: "$image",
                        _id: "$_id",
                    },
                },
            },
        },
        {
            $project: {
                _id: "$id",
                title: "$title",
                image: "$image",
                year: "$year",
            },
        },
        {
            $skip: limit * page,
        },
        {
            $limit: limit,
        },
    ]);

    res.json({
        results,
        pagination: {
            page,
            limit,
            total: (await mediaModel.distinct("imdbId")).length,
        },
    });
};
