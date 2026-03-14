const socket = io({ autoConnect: false, reconnection: true });
const chess = new Chess();

const elements = {
    board: document.querySelector(".chessboard"),
    status: document.querySelector("[data-status]"),
    role: document.querySelector("[data-role]"),
    opponent: document.querySelector("[data-opponent]"),
    notice: document.querySelector("[data-notice]"),
    authCard: document.querySelector("[data-auth-card]"),
    settingsCard: document.querySelector("[data-settings-card]"),
    historyCard: document.querySelector("[data-history-card]"),
    registerForm: document.querySelector("[data-register-form]"),
    loginForm: document.querySelector("[data-login-form]"),
    settingsForm: document.querySelector("[data-settings-form]"),
    logout: document.querySelector("[data-logout]"),
    loading: document.querySelector("[data-loading]"),
    loadingText: document.querySelector("[data-loading-text]"),
    gameActions: document.querySelector("[data-game-actions]"),
    rematch: document.querySelector("[data-rematch]"),
    newOpponent: document.querySelector("[data-new-opponent]"),
    userName: document.querySelector("[data-user-name]"),
    historyList: document.querySelector("[data-history-list]")
};

const initialUser = window.__INITIAL_USER__;

const state = {
    selectedSquare: null,
    validTargets: [],
    sourceSquare: null,
    lastMove: null,
    role: null,
    opponent: null,
    user: initialUser,
    connected: false
};

const unicode = { k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟︎", K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘", P: "♙" };
const toSquare = (r, c) => `${String.fromCharCode(97 + c)}${8 - r}`;
const canMovePiece = (piece) => state.role && piece && piece.color === state.role && chess.turn() === state.role;

const request = async (url, options = {}) => {
    const response = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        ...options
    });
    const body = await response.json();
    if (!response.ok) throw new Error(body.message || "Request failed.");
    return body;
};

const showLoading = (message) => {
    elements.loadingText.textContent = message || "Waiting for player...";
    elements.loading.classList.remove("hidden");
};
const hideLoading = () => elements.loading.classList.add("hidden");

const setNotice = (message, error = false) => {
    elements.notice.textContent = message;
    elements.notice.style.color = error ? "#fca5a5" : "#93c5fd";
};

const updateAuthUI = () => {
    const authenticated = Boolean(state.user);
    elements.authCard.classList.toggle("hidden", authenticated);
    elements.settingsCard.classList.toggle("hidden", !authenticated);
    elements.historyCard.classList.toggle("hidden", !authenticated);

    if (authenticated) {
        elements.userName.textContent = state.user.name;
        elements.settingsForm.name.value = state.user.name;
        elements.settingsForm.theme.value = state.user.theme || "classic";
        elements.settingsForm.preferredColor.value = state.user.preferredColor || "random";
        document.body.classList.toggle("theme-midnight", (state.user.theme || "classic") === "midnight");
    }
};

const updateRoleLabel = () => {
    if (state.role === "w") elements.role.textContent = "You play as White";
    else if (state.role === "b") elements.role.textContent = "You play as Black";
    else elements.role.textContent = "Waiting for match...";
};

const updateStatus = (payload = {}) => {
    const turn = payload.turn || chess.turn();
    if (payload.isGameOver || chess.game_over()) {
        if (payload.checkmate || chess.in_checkmate()) {
            elements.status.textContent = `Checkmate! ${turn === "w" ? "Black" : "White"} wins.`;
        } else {
            elements.status.textContent = "Game drawn.";
        }
        elements.gameActions.classList.remove("hidden");
        return;
    }

    elements.gameActions.classList.add("hidden");
    elements.status.textContent = payload.check || chess.in_check() ? `${turn === "w" ? "White" : "Black"} to move — check!` : `${turn === "w" ? "White" : "Black"} to move`;
};

const renderBoard = () => {
    const board = chess.board();
    elements.board.innerHTML = "";

    board.forEach((row, r) => {
        row.forEach((piece, c) => {
            const square = toSquare(r, c);
            const sq = document.createElement("div");
            sq.classList.add("square", (r + c) % 2 === 0 ? "light" : "dark");
            if (state.selectedSquare === square) sq.classList.add("selected");
            if (state.validTargets.includes(square)) sq.classList.add("valid-target");
            if (state.lastMove && (state.lastMove.from === square || state.lastMove.to === square)) sq.classList.add("last-move");

            sq.addEventListener("click", () => {
                const clickedPiece = chess.get(square);
                if (state.selectedSquare && state.validTargets.includes(square)) {
                    socket.emit("move", { from: state.selectedSquare, to: square, promotion: "q" });
                    state.selectedSquare = null;
                    state.validTargets = [];
                    renderBoard();
                    return;
                }

                if (canMovePiece(clickedPiece)) {
                    state.selectedSquare = square;
                    state.validTargets = chess.moves({ square, verbose: true }).map((m) => m.to);
                } else {
                    state.selectedSquare = null;
                    state.validTargets = [];
                }

                renderBoard();
            });

            sq.addEventListener("dragover", (e) => e.preventDefault());
            sq.addEventListener("drop", (e) => {
                e.preventDefault();
                if (!state.sourceSquare) return;
                socket.emit("move", { from: state.sourceSquare, to: square, promotion: "q" });
            });

            if (piece) {
                const pieceEl = document.createElement("div");
                pieceEl.classList.add("piece", piece.color === "w" ? "white" : "black");
                pieceEl.textContent = unicode[piece.type] || "";
                const draggable = canMovePiece(piece);
                pieceEl.draggable = draggable;

                pieceEl.addEventListener("dragstart", (e) => {
                    if (!draggable) return;
                    state.sourceSquare = square;
                    state.selectedSquare = square;
                    state.validTargets = chess.moves({ square, verbose: true }).map((m) => m.to);
                    renderBoard();
                    e.dataTransfer.setData("text/plain", "");
                });

                pieceEl.addEventListener("dragend", () => {
                    state.sourceSquare = null;
                    state.selectedSquare = null;
                    state.validTargets = [];
                    renderBoard();
                });

                sq.appendChild(pieceEl);
            }

            elements.board.appendChild(sq);
        });
    });

    elements.board.classList.toggle("flipped", state.role === "b");
};

const loadHistory = async () => {
    try {
        const data = await request("/api/games/history");
        elements.historyList.innerHTML = "";
        if (!data.games.length) {
            elements.historyList.innerHTML = "<li>No games yet.</li>";
            return;
        }

        data.games.forEach((game) => {
            const li = document.createElement("li");
            li.textContent = `${new Date(game.createdAt).toLocaleString()} • ${game.players.white.name} vs ${game.players.black.name} • ${game.result}`;
            elements.historyList.appendChild(li);
        });
    } catch (error) {
        setNotice(error.message, true);
    }
};

const connectSocket = () => {
    if (state.connected) return;
    state.connected = true;
    socket.connect();
    showLoading("Waiting for an opponent...");
};

const applyUserAndConnect = async (user) => {
    state.user = user;
    updateAuthUI();
    await loadHistory();
    connectSocket();
    setNotice("Queued for match.");
};

elements.registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        const fd = new FormData(elements.registerForm);
        const payload = Object.fromEntries(fd.entries());
        const data = await request("/api/auth/register", { method: "POST", body: JSON.stringify(payload) });
        await applyUserAndConnect(data.user);
    } catch (error) {
        setNotice(error.message, true);
    }
});

elements.loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        const fd = new FormData(elements.loginForm);
        const payload = Object.fromEntries(fd.entries());
        const data = await request("/api/auth/login", { method: "POST", body: JSON.stringify(payload) });
        await applyUserAndConnect(data.user);
    } catch (error) {
        setNotice(error.message, true);
    }
});

elements.settingsForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        const payload = Object.fromEntries(new FormData(elements.settingsForm).entries());
        const data = await request("/api/user/settings", { method: "PUT", body: JSON.stringify(payload) });
        state.user = data.user;
        updateAuthUI();
        setNotice(data.message);
        socket.emit("queue:join", state.user.preferredColor);
    } catch (error) {
        setNotice(error.message, true);
    }
});

elements.logout.addEventListener("click", async () => {
    await request("/api/auth/logout", { method: "POST", body: JSON.stringify({}) });
    socket.disconnect();
    state.connected = false;
    state.user = null;
    state.role = null;
    state.opponent = null;
    chess.reset();
    updateAuthUI();
    hideLoading();
    renderBoard();
    updateRoleLabel();
    setNotice("Logged out.");
});

elements.rematch.addEventListener("click", () => {
    socket.emit("game:rematch");
    setNotice("Rematch requested.");
});

elements.newOpponent.addEventListener("click", () => {
    socket.emit("game:newOpponent");
    showLoading("Finding a new opponent...");
    setNotice("Searching for another player...");
});

socket.on("queueStatus", (payload) => {
    if (payload.waiting) showLoading(payload.message);
    else hideLoading();
    setNotice(payload.message);
});

socket.on("matchFound", ({ role, opponent }) => {
    state.role = role;
    state.opponent = opponent;
    elements.opponent.textContent = `Opponent: ${opponent}`;
    updateRoleLabel();
    hideLoading();
    setNotice("Match found. Good luck!");
    renderBoard();
});

socket.on("boardState", (payload) => {
    chess.load(payload.fen);
    updateStatus(payload);
    renderBoard();
});

socket.on("move", (move) => {
    chess.move(move);
    state.lastMove = move;
    state.selectedSquare = null;
    state.validTargets = [];
    updateStatus();
    renderBoard();
});

socket.on("gameOver", (payload) => {
    if (payload.checkmate) setNotice(`Checkmate! ${payload.winner} wins.`);
    else setNotice("Game drawn.");
    elements.gameActions.classList.remove("hidden");
    loadHistory();
});

socket.on("rematchStatus", (payload) => {
    setNotice(`Rematch votes: ${payload.accepted}/${payload.required}`);
});

socket.on("opponentLeft", ({ message }) => {
    state.role = null;
    state.opponent = null;
    elements.opponent.textContent = "Opponent: -";
    updateRoleLabel();
    showLoading(message || "Opponent left. Re-queueing...");
    setNotice(message || "Opponent left.");
});

socket.on("invalidMove", ({ reason }) => {
    setNotice(reason || "Invalid move.", true);
});

socket.on("connect_error", () => {
    setNotice("Socket auth failed. Please login again.", true);
    hideLoading();
});

updateAuthUI();
updateRoleLabel();
updateStatus();
renderBoard();
if (state.user) {
    connectSocket();
    loadHistory();
}
