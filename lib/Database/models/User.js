const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    username: {
        type: String,
    },
    password: {
        type: String,
        set: (value) => {
            return value;
        }
    }
});

schema.methods.checkPassword = (password) => {

};

mongoose.model("user", schema);
