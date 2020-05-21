const mongoose = require("mongoose");

export default async (req, res) => {
    const userModel = mongoose.model("user");
    const { username, password } = req.body;

    const user = await userModel.findOne({ username });
    if (!user || !user.checkPassword(password)) {
        return res.json({error: "Wrong username / password."});
    }

    res.json({token: await user.getToken()});
};
