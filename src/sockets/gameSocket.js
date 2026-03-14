const { ROLE_OPTIONS } = require("../config/constants");
const { getSessionFromSocket } = require("../services/sessionService");
const { chess, players, resetSeatBySocket } = require("../game/gameState");

const emitGameState = (io) => {
    io.emit("boardState", {
        fen: chess.fen(),
        turn: chess.turn(),
        isGameOver: chess.isGameOver(),
        checkmate: chess.isCheckmate(),
        draw: chess.isDraw(),
        check: chess.inCheck()
    });
};

const getRoleForSocket = (socketId) => {
    if (players.white?.socketId === socketId) return "w";
    if (players.black?.socketId === socketId) return "b";
    return null;
};

const tryAssignSeat = (socket, preferredRole) => {
    const username = socket.data.username;

    if (!username) {
        socket.emit("spectatorRole");
        return;
    }

    if (players.white?.username === username) {
        players.white.socketId = socket.id;
        socket.emit("playerRole", "w");
        return;
    }

    if (players.black?.username === username) {
        players.black.socketId = socket.id;
        socket.emit("playerRole", "b");
        return;
    }

    if (preferredRole === ROLE_OPTIONS.SPECTATOR) {
        socket.emit("spectatorRole");
        return;
    }

    if (preferredRole === ROLE_OPTIONS.WHITE && !players.white) {
        players.white = { socketId: socket.id, username };
        socket.emit("playerRole", "w");
        return;
    }

    if (preferredRole === ROLE_OPTIONS.BLACK && !players.black) {
        players.black = { socketId: socket.id, username };
        socket.emit("playerRole", "b");
        return;
    }

    if (!players.white) {
        players.white = { socketId: socket.id, username };
        socket.emit("playerRole", "w");
        return;
    }

    if (!players.black) {
        players.black = { socketId: socket.id, username };
        socket.emit("playerRole", "b");
        return;
    }

    socket.emit("spectatorRole");
};

const initializeGameSocket = (io) => {
    io.use((socketInstance, next) => {
        const session = getSessionFromSocket(socketInstance);

        socketInstance.data.username = session?.data?.username || null;
        socketInstance.data.preferredRole = session?.data?.preferredRole || ROLE_OPTIONS.ANY;

        next();
    });

    io.on("connection", (socket) => {
        tryAssignSeat(socket, socket.data.preferredRole);

        socket.emit("authState", {
            isAuthenticated: Boolean(socket.data.username),
            username: socket.data.username,
            preferredRole: socket.data.preferredRole
        });

        emitGameState(io);

        socket.on("requestRole", (rolePreference) => {
            tryAssignSeat(socket, rolePreference || socket.data.preferredRole);
            emitGameState(io);
        });

        socket.on("move", (move) => {
            const currentRole = getRoleForSocket(socket.id);

            if (!currentRole || currentRole !== chess.turn()) {
                socket.emit("invalidMove", { move, reason: "Not your turn or role." });
                return;
            }

            try {
                const result = chess.move(move);
                if (!result) {
                    socket.emit("invalidMove", { move, reason: "Illegal move." });
                    return;
                }

                io.emit("move", result);
                emitGameState(io);
            } catch (error) {
                socket.emit("invalidMove", { move, reason: "Unable to apply move." });
            }
        });

        socket.on("disconnect", () => {
            resetSeatBySocket(socket.id);
        });
    });
};

module.exports = {
    initializeGameSocket
};
