const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        publicId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50
        },
        hash: {
            type: String,
            required: true
        },
        salt: {
            type: String,
            required: true
        },
        settings: {
            theme: {
                type: String,
                default: "classic"
            }
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model("User", userSchema);
