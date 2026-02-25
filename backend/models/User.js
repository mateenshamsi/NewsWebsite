const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model("User", userSchema); 