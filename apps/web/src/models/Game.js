const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
    {
        publicId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        roomId: {
            type: String,
            required: true,
            index: true
        },
        result: {
            type: String,
            required: true
        },
        reason: {
            type: String,
            required: true
        },
        pgn: {
            type: String,
            default: ""
        },
        fen: {
            type: String,
            required: true
        },
        players: {
            white: {
                userId: { type: String, required: true },
                name: { type: String, required: true }
            },
            black: {
                userId: { type: String, required: true },
                name: { type: String, required: true }
            }
        },
        playerIds: {
            type: [String],
            required: true,
            index: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model("Game", gameSchema);
