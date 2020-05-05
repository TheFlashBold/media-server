const mongoose = require("mongoose");

export default async (req, res) => {
    let {
        query: { limit, page, libraryId },
    } = req;

    const libraryModel = mongoose.model("library");
    const library = await libraryModel.findOne({ _id: libraryId });

    if (!library) {
        return res.status(404);
    }

    const mediaModel = mongoose.model("media");

    limit = parseInt(limit) || 20;
    page = parseInt(page) || 0;

    const results = await mediaModel.aggregate([
        {
            $match: { library: library._id },
        },
        {
            $sort: { title: -1, season: 1, episode: 1 },
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
        library,
        pagination: {
            page,
            limit,
            total: (
                await mediaModel.aggregate([
                    {
                        $match: { library: library._id },
                    },
                    {
                        $group: {
                            _id: "$title",
                        },
                    },
                ])
            ).length,
        },
    });
};
