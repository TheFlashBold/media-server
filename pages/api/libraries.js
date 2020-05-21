const { getUser } = require("../../lib/Auth");
const mongoose = require("mongoose");

export default async (req, res) => {
    if (!(await getUser(req, res))) return;

    const libraryModel = mongoose.model("library");
    const libraries = await libraryModel.find().lean();

    res.json(libraries);
};
