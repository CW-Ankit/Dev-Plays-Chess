const crypto = require("crypto");
const Game = require("../models/Game");
const { assertDatabaseConnection } = require("../db/mongoose");

const mapGame = (gameDoc) => ({
    id: gameDoc.publicId,
    roomId: gameDoc.roomId,
    result: gameDoc.result,
    reason: gameDoc.reason,
    pgn: gameDoc.pgn,
    fen: gameDoc.fen,
    players: gameDoc.players,
    playerIds: gameDoc.playerIds,
    createdAt: gameDoc.createdAt
});

const saveGame = async (game) => {
    assertDatabaseConnection();
    const gameDoc = await Game.create({
        publicId: crypto.randomUUID(),
        ...game
    });

    return mapGame(gameDoc.toObject());
};

const listGamesForUser = async (userId) => {
    assertDatabaseConnection();
    const gameDocs = await Game.find({ playerIds: userId }).sort({ createdAt: -1 }).limit(20).lean();
    return gameDocs.map(mapGame);
};

module.exports = {
    saveGame,
    listGamesForUser
};
