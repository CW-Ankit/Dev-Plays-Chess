const socket = io({ autoConnect: false });
const chess = new Chess();

const boardElement = document.querySelector(".chessboard");
const statusElement = document.querySelector("[data-game-status]");
const roleElement = document.querySelector("[data-player-role]");
const authMessageElement = document.querySelector("[data-auth-message]");
const usernameElement = document.querySelector("[data-username]");
const preferredRoleElement = document.querySelector("[data-preferred-role]");
const leaveButton = document.querySelector("[data-leave]");
const appShell = document.querySelector("[data-app-shell]");
const playOverlay = document.querySelector("[data-play-overlay]");
const startForm = document.querySelector("[data-start-form]");

const initialAuth = window.__INITIAL_AUTH__ || {
    isAuthenticated: false,
    username: null,
    preferredRole: "any"
};

let sourceSquare = null;
let playerRole = null;
let selectedSquare = null;
let validMoveTargets = [];
let lastMove = null;
let started = false;

const roleLabelMap = {
    w: "White",
    b: "Black",
    any: "Any",
    spectator: "Spectator"
};

const toSquare = (row, col) => `${String.fromCharCode(97 + col)}${8 - row}`;

const clearSelection = () => {
    selectedSquare = null;
    validMoveTargets = [];
};

const canMovePiece = (piece) => playerRole && piece && piece.color === playerRole && chess.turn() === playerRole;

const updateStatus = (state = {}) => {
    const turn = state.turn || chess.turn();

    if (state.isGameOver || chess.game_over()) {
        if (state.checkmate || chess.in_checkmate()) {
            statusElement.textContent = `Checkmate! ${turn === "w" ? "Black" : "White"} wins.`;
            return;
        }

        statusElement.textContent = "Draw game.";
        return;
    }

    if (state.check || chess.in_check()) {
        statusElement.textContent = `${turn === "w" ? "White" : "Black"} to move — check!`;
        return;
    }

    statusElement.textContent = `${turn === "w" ? "White" : "Black"} to move`;
};

const updateRole = () => {
    if (playerRole === "w") {
        roleElement.textContent = "You are White";
    } else if (playerRole === "b") {
        roleElement.textContent = "You are Black";
    } else {
        roleElement.textContent = "You are Spectating";
    }
};

const getValidMovesFrom = (fromSquare) => chess.moves({ square: fromSquare, verbose: true });

const getPieceUnicode = (piece) => {
    const unicodePieces = {
        k: "♚",
        q: "♛",
        r: "♜",
        b: "♝",
        n: "♞",
        p: "♟︎",
        K: "♔",
        Q: "♕",
        R: "♖",
        B: "♗",
        N: "♘",
        P: "♙"
    };

    return unicodePieces[piece.type] || "";
};

const renderBoard = () => {
    const board = chess.board();
    boardElement.innerHTML = "";

    board.forEach((row, rowIndex) => {
        row.forEach((square, squareIndex) => {
            const squareElement = document.createElement("div");
            const algebraic = toSquare(rowIndex, squareIndex);

            squareElement.classList.add("square", (rowIndex + squareIndex) % 2 === 0 ? "light" : "dark");

            if (selectedSquare === algebraic) squareElement.classList.add("selected");
            if (validMoveTargets.includes(algebraic)) squareElement.classList.add("valid-target");
            if (lastMove && (lastMove.from === algebraic || lastMove.to === algebraic)) squareElement.classList.add("last-move");

            squareElement.addEventListener("click", () => {
                const clickedPiece = chess.get(algebraic);

                if (selectedSquare && validMoveTargets.includes(algebraic)) {
                    socket.emit("move", { from: selectedSquare, to: algebraic, promotion: "q" });
                    clearSelection();
                    renderBoard();
                    return;
                }

                if (canMovePiece(clickedPiece)) {
                    selectedSquare = algebraic;
                    validMoveTargets = getValidMovesFrom(algebraic).map((move) => move.to);
                } else {
                    clearSelection();
                }

                renderBoard();
            });

            squareElement.addEventListener("dragover", (event) => event.preventDefault());
            squareElement.addEventListener("drop", (event) => {
                event.preventDefault();
                if (!sourceSquare) return;
                socket.emit("move", { from: sourceSquare, to: algebraic, promotion: "q" });
            });

            if (square) {
                const pieceElement = document.createElement("div");
                pieceElement.classList.add("piece", square.color === "w" ? "white" : "black");
                pieceElement.innerText = getPieceUnicode(square);

                const pieceCanMove = canMovePiece(square);
                pieceElement.draggable = pieceCanMove;

                pieceElement.addEventListener("dragstart", (event) => {
                    if (!pieceCanMove) return;

                    sourceSquare = algebraic;
                    selectedSquare = algebraic;
                    validMoveTargets = getValidMovesFrom(algebraic).map((move) => move.to);
                    renderBoard();

                    event.dataTransfer.setData("text/plain", "");
                });

                pieceElement.addEventListener("dragend", () => {
                    sourceSquare = null;
                    clearSelection();
                    renderBoard();
                });

                squareElement.appendChild(pieceElement);
            }

            boardElement.appendChild(squareElement);
        });
    });

    if (playerRole === "b") {
        boardElement.classList.add("flipped");
    } else {
        boardElement.classList.remove("flipped");
    }
};

const setAuthState = ({ isAuthenticated, username, preferredRole }) => {
    usernameElement.textContent = isAuthenticated ? username : "Guest";
    preferredRoleElement.textContent = roleLabelMap[preferredRole] || "Any";

    if (isAuthenticated) {
        playOverlay.classList.add("hidden");
        appShell.classList.remove("blurred");
        leaveButton.classList.remove("hidden");
    } else {
        playOverlay.classList.remove("hidden");
        appShell.classList.add("blurred");
        leaveButton.classList.add("hidden");
    }
};

const connectGameSocket = () => {
    if (started) return;
    started = true;
    socket.connect();
};

startForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(startForm);

    const payload = {
        name: formData.get("name"),
        preferredRole: formData.get("preferredRole")
    };

    try {
        const response = await fetch("/auth/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await response.json();

        if (!response.ok) {
            authMessageElement.textContent = data.message || "Unable to start.";
            authMessageElement.classList.add("error");
            return;
        }

        authMessageElement.textContent = data.message;
        authMessageElement.classList.remove("error");
        setAuthState({ isAuthenticated: true, ...data });
        connectGameSocket();
    } catch (error) {
        authMessageElement.textContent = "Network error. Please try again.";
        authMessageElement.classList.add("error");
    }
});

leaveButton.addEventListener("click", async () => {
    await fetch("/auth/logout", { method: "POST" });
    socket.disconnect();
    started = false;
    playerRole = null;
    clearSelection();
    updateRole();
    setAuthState({ isAuthenticated: false, username: null, preferredRole: "any" });
});

socket.on("playerRole", (role) => {
    playerRole = role;
    updateRole();
    renderBoard();
});

socket.on("spectatorRole", () => {
    playerRole = null;
    updateRole();
    renderBoard();
});

socket.on("authState", (state) => {
    setAuthState(state);
});

socket.on("boardState", (state) => {
    chess.load(state.fen);
    updateStatus(state);
    renderBoard();
});

socket.on("move", (move) => {
    chess.move(move);
    lastMove = move;
    clearSelection();
    updateStatus();
    renderBoard();
});

socket.on("invalidMove", ({ reason }) => {
    authMessageElement.textContent = reason || "Invalid move.";
    authMessageElement.classList.add("error");
    clearSelection();
    renderBoard();
});

updateRole();
updateStatus();
setAuthState(initialAuth);
if (initialAuth.isAuthenticated) {
    connectGameSocket();
}
renderBoard();
