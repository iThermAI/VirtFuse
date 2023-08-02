const mongoose = require("mongoose");

// define the schema of a model in the db
const UserInfoSchema = new mongoose.Schema({
    email: String,
    password: String,
    admin: Boolean
});

module.exports = mongoose.model("UserInfo", UserInfoSchema);
