const mongoose = require("mongoose");

export default async (req, res) => {
    let {
        query: { limit, page, libraryId },
    } = req;

    const libraryModel = mongoose.model("library");
    const library = await libraryModel.findOne({ _id: libraryId }).lean();

    if (!library) {
        return res.status(404);
    }

    const mediaModel = mongoose.model("media");

    limit = parseInt(limit) || 20;
    page = parseInt(page) || 0;

    const results = await mediaModel
        .find({ library: libraryId })
        .skip(limit * page)
        .limit(limit)
        .lean();

    res.json({
        results,
        library,
        pagination: {
            page,
            limit,
            total: await mediaModel.count({ _id: libraryId }),
        },
    });
};
