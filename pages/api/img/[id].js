const { getUser } = require("../../lib/Auth");
const mongoose = require("mongoose");

export default async (req, res) => {
    if (!(await getUser(req, res))) return;

    const {
        query: { id, size },
    } = req;

    const imageModel = mongoose.model("image");

    const image = await imageModel.findOne({ _id: id });
    if (!image) {
        return res.status(404);
    }

    res.setHeader("Content-Type", await image.getMimeType());

    const imageStream = await image.getSize(size);
    imageStream.pipe(res, { end: true });
};
