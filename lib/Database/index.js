const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    require("./models/Collection");
    require("./models/Media");
    require("./models/Library");
    require("./models/User");
    require("./models/Image");
  });
