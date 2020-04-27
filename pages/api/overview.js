const mongoose = require("mongoose");

export default async (req, res) => {
    const mediaModel = mongoose.model("media");

    const titles = await mediaModel.aggregate([
        {
            $sort: { title: 1, season: 1, episode: 1 }
        },
        {
            $group: {
                _id: "$imdbId",
                title: { $first: "$title" },
                image: { $first: "$image" },
                year: { $first: "$year" },
                media: {
                    $push: {
                        episode: "$episode",
                        season: "$season",
                        image: "$image",
                        _id: "$_id"
                    }
                }
            }
        }
    ]);

    res.json(titles);
};
