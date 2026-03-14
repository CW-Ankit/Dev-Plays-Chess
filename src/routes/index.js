const express = require("express");
const { validateStartPayload } = require("../services/playerAuthService");
const {
    createSession,
    setSessionCookie,
    clearSessionCookie,
    getSessionFromRequest,
    deleteSession
} = require("../services/sessionService");
const { resetSeatByUsername } = require("../game/gameState");

const createRouter = () => {
    const router = express.Router();

    router.get("/", (req, res) => {
        const session = getSessionFromRequest(req);
        res.render("index", {
            title: "Chess Game",
            isAuthenticated: Boolean(session?.data?.username),
            username: session?.data?.username || null,
            preferredRole: session?.data?.preferredRole || "any"
        });
    });

    router.post("/auth/start", (req, res) => {
        const { error, data } = validateStartPayload(req.body || {});
        if (error) {
            return res.status(400).json({ message: error });
        }

        const sessionId = createSession(data);
        setSessionCookie(res, sessionId);

        return res.json({
            message: "Ready to play!",
            username: data.username,
            preferredRole: data.preferredRole
        });
    });

    router.post("/auth/logout", (req, res) => {
        const session = getSessionFromRequest(req);
        const username = session?.data?.username || null;

        if (session?.sessionId) {
            deleteSession(session.sessionId);
        }

        if (username) {
            resetSeatByUsername(username);
        }

        clearSessionCookie(res);
        return res.json({ message: "Left the game." });
    });

    return router;
};

module.exports = {
    createRouter
};
