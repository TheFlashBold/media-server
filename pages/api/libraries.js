const mongoose = require("mongoose");

export default async (req, res) => {
    const libraryModel = mongoose.model("library");
    const libraries = await libraryModel.find().lean();

    res.json(libraries);
};
