const crypto = require("crypto");
const { connectDatabase } = require("../db/mongoClient");

const saveGame = async (game) => {
    const { mode, db } = await connectDatabase();
    const gameDoc = {
        id: crypto.randomUUID(),
        ...game,
        createdAt: new Date().toISOString()
    };

    if (mode === "mongo") {
        await db.collection("games").insertOne(gameDoc);
    } else {
        db.games.unshift(gameDoc);
    }

    return gameDoc;
};

const listGamesForUser = async (userId) => {
    const { mode, db } = await connectDatabase();

    if (mode === "mongo") {
        return db
            .collection("games")
            .find({ playerIds: userId })
            .sort({ createdAt: -1 })
            .limit(20)
            .toArray();
    }

    return db.games.filter((g) => g.playerIds.includes(userId)).slice(0, 20);
};

module.exports = {
    saveGame,
    listGamesForUser
};
