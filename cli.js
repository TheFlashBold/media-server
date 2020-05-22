const Database = require("./lib/Database");
const mongoose = require("mongoose");

Database.then(() => {
    const [, , action, ...params] = process.argv;

    switch (action.toLowerCase()) {
        case "adduser":
            const [username, password] = params;
            Database.then(async () => {
                const userModel = mongoose.model("user");
                const user = new userModel({ username, password });
                await user.save();
                console.log(`Added user "${username}".`);
                process.exit(0);
            });
            break;
        case "help":
        default:
            console.log(
                [
                    "Usage:",
                    "help #shows this screen",
                    "adduser <username> <password> #add user",
                ].join("\n")
            );
            process.exit(0);
    }
});
