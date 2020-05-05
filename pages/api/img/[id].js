import m from "gm";

const mongoose = require("mongoose");

export default async (req, res) => {
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
