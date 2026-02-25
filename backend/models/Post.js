const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            minlength: 5,
            maxlength: 200,
        },

        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },

        content: {
            type: String,
            required: [true, "Content is required"],
        },

        image: {
            type: String, // store image URL (Cloudinary or other)
        },

        category: {
            type: String,
            default: "General",
        },

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true, // automatically adds createdAt & updatedAt
    }
);

module.exports = mongoose.model("Post", postSchema); 