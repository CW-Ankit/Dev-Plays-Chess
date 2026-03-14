const crypto = require("crypto");
const { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } = require("../config/constants");

const sessions = new Map();

const parseCookies = (cookieHeader = "") => {
    return cookieHeader
        .split(";")
        .map((item) => item.trim())
        .filter(Boolean)
        .reduce((acc, pair) => {
            const [key, ...valueParts] = pair.split("=");
            acc[key] = decodeURIComponent(valueParts.join("="));
            return acc;
        }, {});
};

const setSessionCookie = (res, sessionId) => {
    res.setHeader(
        "Set-Cookie",
        `${SESSION_COOKIE}=${encodeURIComponent(sessionId)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_MAX_AGE_SECONDS}`
    );
};

const clearSessionCookie = (res) => {
    res.setHeader("Set-Cookie", `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`);
};

const createSession = (payload) => {
    const sessionId = crypto.randomUUID();
    sessions.set(sessionId, { ...payload, createdAt: Date.now() });
    return sessionId;
};

const getSession = (sessionId) => sessions.get(sessionId) || null;

const getSessionFromRequest = (req) => {
    const cookies = parseCookies(req.headers.cookie);
    const sessionId = cookies[SESSION_COOKIE];
    if (!sessionId) return null;

    const data = getSession(sessionId);
    if (!data) return null;

    return { sessionId, data };
};

const getSessionFromSocket = (socket) => {
    const cookies = parseCookies(socket.handshake.headers.cookie);
    const sessionId = cookies[SESSION_COOKIE];
    if (!sessionId) return null;

    const data = getSession(sessionId);
    if (!data) return null;

    return { sessionId, data };
};

const deleteSession = (sessionId) => sessions.delete(sessionId);

module.exports = {
    createSession,
    getSession,
    getSessionFromRequest,
    getSessionFromSocket,
    deleteSession,
    setSessionCookie,
    clearSessionCookie
};
