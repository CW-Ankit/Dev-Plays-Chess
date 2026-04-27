import mongoose from "mongoose";

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
            },
            preferredColor: {
                type: String,
                default: "random"
            }
        },
        elo: {
            type: Number,
            default: 1200
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export const User = mongoose.model("User", userSchema);
