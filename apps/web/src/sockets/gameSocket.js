const { getSessionFromSocket } = require("../services/sessionService");
const {
    enqueuePlayer,
    removeWaitingPlayer,
    findMatchFor,
    getGameBySocket,
    removeSocketFromGame
} = require("../game/matchmaking");
const { saveGame } = require("../repositories/gameRepository");
const { COLOR_PREF } = require("../config/constants");

const emitWaiting = (socket, message) => {
    socket.emit("queueStatus", { waiting: true, message });
};

const emitBoardState = (io, game) => {
    io.to(game.id).emit("boardState", {
        fen: game.chess.fen(),
        turn: game.chess.turn(),
        check: game.chess.inCheck(),
        isGameOver: game.chess.isGameOver(),
        checkmate: game.chess.isCheckmate(),
        draw: game.chess.isDraw()
    });
};

const emitMatchFound = (game) => {
    const white = game.players.w;
    const black = game.players.b;

    white.socket.join(game.id);
    black.socket.join(game.id);

    white.socket.emit("matchFound", {
        roomId: game.id,
        role: "w",
        opponent: black.name
    });

    black.socket.emit("matchFound", {
        roomId: game.id,
        role: "b",
        opponent: white.name
    });
};

const queuePlayer = (socket) => {
    const preferredColor = socket.data.preferredColor || COLOR_PREF.RANDOM;

    enqueuePlayer(socket, {
        userId: socket.data.userId,
        name: socket.data.name,
        preferredColor
    });

    const game = findMatchFor(socket.id);

    if (!game) {
        emitWaiting(socket, "Waiting for an opponent...");
        return null;
    }

    emitMatchFound(game);
    emitBoardState(socket.nsp, game);
    socket.nsp.to(game.id).emit("queueStatus", { waiting: false, message: "Match started" });

    return game;
};

const getPlayerRole = (game, socketId) => {
    if (game.players.w.socket.id === socketId) return "w";
    if (game.players.b.socket.id === socketId) return "b";
    return null;
};

const finalizeGame = async (game, reason) => {
    const winner = game.chess.isCheckmate() ? (game.chess.turn() === "w" ? "b" : "w") : "draw";

    await saveGame({
        roomId: game.id,
        result: winner,
        reason,
        pgn: game.chess.pgn(),
        fen: game.chess.fen(),
        players: {
            white: { userId: game.players.w.userId, name: game.players.w.name },
            black: { userId: game.players.b.userId, name: game.players.b.name }
        },
        playerIds: [game.players.w.userId, game.players.b.userId]
    });
};

const initializeGameSocket = (io) => {
    io.use((socket, next) => {
        const session = getSessionFromSocket(socket);
        const guestData = socket.handshake.auth?.guestData;

        if (!session?.data?.userId && !guestData) {
            return next(new Error("Unauthorized"));
        }

        if (session?.data?.userId) {
            socket.data.userId = session.data.userId;
            socket.data.name = session.data.name;
            socket.data.theme = session.data.theme || "classic";
            socket.data.preferredColor = session.data.preferredColor || COLOR_PREF.RANDOM;
        } else {
            socket.data.userId = `guest_${socket.id}`;
            socket.data.name = guestData.name || "Mobile Guest";
            socket.data.theme = "classic";
            socket.data.preferredColor = COLOR_PREF.RANDOM;
        }
        return next();
    });

    io.on("connection", (socket) => {
        socket.emit("authState", {
            isAuthenticated: true,
            user: {
                id: socket.data.userId,
                name: socket.data.name,
                preferredColor: socket.data.preferredColor,
                theme: socket.data.theme
            }
        });

        queuePlayer(socket);

        socket.on("queue:join", (preferredColor) => {
            socket.data.preferredColor = preferredColor || socket.data.preferredColor;
            removeWaitingPlayer(socket.id);
            const currentGame = removeSocketFromGame(socket.id);
            if (currentGame) {
                socket.nsp.to(currentGame.id).emit("opponentLeft", { message: "Opponent left. Finding new match..." });
                const otherSocket = currentGame.players.w.socket.id === socket.id ? currentGame.players.b.socket : currentGame.players.w.socket;
                otherSocket.leave(currentGame.id);
                queuePlayer(otherSocket);
            }
            queuePlayer(socket);
        });

        socket.on("move", async (move) => {
            const game = getGameBySocket(socket.id);
            if (!game) return;

            const role = getPlayerRole(game, socket.id);
            if (!role || role !== game.chess.turn()) {
                socket.emit("invalidMove", { reason: "Not your turn." });
                return;
            }

            try {
                const result = game.chess.move(move);
                if (!result) {
                    socket.emit("invalidMove", { reason: "Illegal move." });
                    return;
                }

                io.to(game.id).emit("move", result);
                emitBoardState(io, game);

                if (game.chess.isGameOver()) {
                    await finalizeGame(game, "completed");
                    io.to(game.id).emit("gameOver", {
                        checkmate: game.chess.isCheckmate(),
                        draw: game.chess.isDraw(),
                        winner: game.chess.isCheckmate() ? (game.chess.turn() === "w" ? "black" : "white") : "draw"
                    });
                }
            } catch (error) {
                socket.emit("invalidMove", { reason: "Unable to apply move." });
            }
        });

        socket.on("game:rematch", () => {
            const game = getGameBySocket(socket.id);
            if (!game) return;

            game.rematchVotes.add(socket.id);
            io.to(game.id).emit("rematchStatus", { accepted: game.rematchVotes.size, required: 2 });

            if (game.rematchVotes.size === 2) {
                const oldWhite = game.players.w;
                game.players.w = game.players.b;
                game.players.b = oldWhite;
                game.chess.reset();
                game.rematchVotes.clear();

                game.players.w.socket.emit("matchFound", { roomId: game.id, role: "w", opponent: game.players.b.name });
                game.players.b.socket.emit("matchFound", { roomId: game.id, role: "b", opponent: game.players.w.name });
                emitBoardState(io, game);
                io.to(game.id).emit("queueStatus", { waiting: false, message: "Rematch started" });
            }
        });

        socket.on("game:newOpponent", () => {
            const game = removeSocketFromGame(socket.id);
            if (game) {
                const otherSocket = game.players.w.socket.id === socket.id ? game.players.b.socket : game.players.w.socket;
                otherSocket.leave(game.id);
                otherSocket.emit("opponentLeft", { message: "Opponent is finding a new game." });
                queuePlayer(otherSocket);
            }

            queuePlayer(socket);
        });

        socket.on("disconnect", () => {
            removeWaitingPlayer(socket.id);
            const game = removeSocketFromGame(socket.id);
            if (game) {
                const otherSocket = game.players.w.socket.id === socket.id ? game.players.b.socket : game.players.w.socket;
                otherSocket.leave(game.id);
                otherSocket.emit("opponentLeft", { message: "Opponent disconnected. Re-queueing..." });
                queuePlayer(otherSocket);
            }
        });
    });
};

module.exports = {
    initializeGameSocket
};
