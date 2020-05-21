const mongoose = require("mongoose");
const crypto = require("crypto");

const schema = new mongoose.Schema({
    username: {
        type: String,
    },
    password: {
        type: String,
        set: (value) => {
            const salt = crypto.randomBytes(16).toString("hex");
            const hash = crypto
                .pbkdf2Sync(value, salt, 1000, 64, "sha512")
                .toString("hex");
            return salt + "$" + hash;
        },
    },
    libraries: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "library",
        },
    ],
    token: {
        type: String,
    },
});

schema.methods.checkPassword = function (password) {
    const [salt, hash] = this.get("password").split("$");
    const newHash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, "sha512")
        .toString("hex");
    return hash === newHash;
};

schema.methods.getToken = async function () {
    if (this.get("token")) {
        return this.get("token");
    }

    this.set("token", crypto.randomBytes(48).toString("hex"));
    await this.save();
    return this.get("token");
};

mongoose.model("user", schema);
