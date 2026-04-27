import crypto from "crypto";
import { Game } from "@chessdotcom/database";

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

export const saveGame = async (game) => {
    const gameDoc = await Game.create({
        publicId: crypto.randomUUID(),
        ...game
    });

    return mapGame(gameDoc.toObject());
};

export const listGamesForUser = async (userId) => {
    const gameDocs = await Game.find({ playerIds: userId }).sort({ createdAt: -1 }).limit(20).lean();
    return gameDocs.map(mapGame);
};
