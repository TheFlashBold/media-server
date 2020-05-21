const mongoose = require("mongoose");
const { parseCookies, destroyCookie } = require("nookies");

function Unauthorize(req, res) {
    destroyCookie({ req, res }, "Authorization");
    res.json({ error: "Unauthorized!" });
}

export async function getUser(req, res) {
    const { Authorization } = parseCookies({ req });

    if (!Authorization) return Unauthorize(req, res);

    const userModel = mongoose.model("user");
    const user = await userModel.findOne({ token: Authorization });

    if (!user) return Unauthorize(req, res);

    return user;
}
