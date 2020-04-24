const mongoose = require("mongoose");
const send = require("send");

export default async (req, res) => {
    const {
        query: { id },
    } = req;

    const media = await mongoose.model("media").findOne({ _id: id });
    if (!media) {
        return res.json({ error: "Not found" }).status(404);
    }

    res.setHeader("Content-Length", media.getStats().size);
    res.setHeader("Content-Type", await media.getMimeType());

    const stream = send(req, media.get("file"));
    stream.pipe(res);
    
    return new Promise((resolve) => {
        stream.on("end", resolve);
        stream.on("error", resolve);
    });
};
