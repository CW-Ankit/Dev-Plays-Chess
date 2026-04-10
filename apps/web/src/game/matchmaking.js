const crypto = require("crypto");
const { Chess } = require("chess.js");
const { COLOR_PREF } = require("../config/constants");

const waitingPlayers = new Map();
const activeGames = new Map();

const preferenceToChar = (pref) => {
    if (pref === COLOR_PREF.WHITE) return "w";
    if (pref === COLOR_PREF.BLACK) return "b";
    return "random";
};

const chooseColors = (prefA, prefB) => {
    const a = preferenceToChar(prefA);
    const b = preferenceToChar(prefB);

    if (a === "w" && b === "w") return null;
    if (a === "b" && b === "b") return null;

    if (a === "w") return { first: "w", second: "b" };
    if (a === "b") return { first: "b", second: "w" };
    if (b === "w") return { first: "b", second: "w" };
    if (b === "b") return { first: "w", second: "b" };

    const first = Math.random() > 0.5 ? "w" : "b";
    return { first, second: first === "w" ? "b" : "w" };
};

const enqueuePlayer = (socket, meta) => {
    waitingPlayers.set(socket.id, {
        socket,
        ...meta,
        queuedAt: Date.now()
    });
};

const removeWaitingPlayer = (socketId) => waitingPlayers.delete(socketId);

const findMatchFor = (socketId) => {
    const current = waitingPlayers.get(socketId);
    if (!current) return null;

    const candidates = [...waitingPlayers.values()]
        .filter((item) => item.socket.id !== socketId && item.userId !== current.userId)
        .sort((a, b) => a.queuedAt - b.queuedAt);

    for (const candidate of candidates) {
        const colors = chooseColors(current.preferredColor, candidate.preferredColor);
        if (!colors) continue;

        removeWaitingPlayer(current.socket.id);
        removeWaitingPlayer(candidate.socket.id);

        const roomId = `game-${crypto.randomUUID()}`;
        const game = {
            id: roomId,
            chess: new Chess(),
            players: {
                w: colors.first === "w" ? current : candidate,
                b: colors.first === "w" ? candidate : current
            },
            rematchVotes: new Set(),
            createdAt: Date.now()
        };

        activeGames.set(roomId, game);
        return game;
    }

    return null;
};

const getGameBySocket = (socketId) => {
    for (const game of activeGames.values()) {
        if (game.players.w.socket.id === socketId || game.players.b.socket.id === socketId) {
            return game;
        }
    }
    return null;
};

const removeSocketFromGame = (socketId) => {
    const game = getGameBySocket(socketId);
    if (!game) return null;
    activeGames.delete(game.id);
    return game;
};

module.exports = {
    waitingPlayers,
    activeGames,
    enqueuePlayer,
    removeWaitingPlayer,
    findMatchFor,
    getGameBySocket,
    removeSocketFromGame
};
