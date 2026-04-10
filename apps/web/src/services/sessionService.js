const jwt = require("jsonwebtoken");
const { AUTH_COOKIE, AUTH_TOKEN_MAX_AGE_SECONDS } = require("../config/constants");
const { runtime } = require("../config/runtime");

const parseCookies = (cookieHeader = "") => {
    return cookieHeader
        .split(";")
        .map((item) => item.trim())
        .filter(Boolean)
        .reduce((accumulator, pair) => {
            const [key, ...valueParts] = pair.split("=");
            accumulator[key] = decodeURIComponent(valueParts.join("="));
            return accumulator;
        }, {});
};

const buildCookieValue = (name, value, maxAgeSeconds) => {
    const attributes = [
        `${name}=${encodeURIComponent(value)}`,
        "HttpOnly",
        "SameSite=Lax",
        "Path=/",
        `Max-Age=${maxAgeSeconds}`
    ];

    if (runtime.nodeEnv === "production") {
        attributes.push("Secure");
    }

    return attributes.join("; ");
};

const signAuthToken = (payload) => {
    return jwt.sign(payload, runtime.jwtSecret, {
        expiresIn: AUTH_TOKEN_MAX_AGE_SECONDS
    });
};

const verifyAuthToken = (token) => {
    try {
        return jwt.verify(token, runtime.jwtSecret);
    } catch (_error) {
        return null;
    }
};

const setSessionCookie = (res, payload) => {
    const token = signAuthToken(payload);
    const cookie = buildCookieValue(AUTH_COOKIE, token, AUTH_TOKEN_MAX_AGE_SECONDS);

    res.setHeader("Set-Cookie", cookie);
};

const clearSessionCookie = (res) => {
    const cookie = buildCookieValue(AUTH_COOKIE, "", 0);
    res.setHeader("Set-Cookie", cookie);
};

const readSessionFromCookieHeader = (cookieHeader) => {
    const cookies = parseCookies(cookieHeader);
    const token = cookies[AUTH_COOKIE];

    if (!token) {
        return null;
    }

    const data = verifyAuthToken(token);
    if (!data) {
        return null;
    }

    return { data };
};

const getSessionFromRequest = (req) => {
    return readSessionFromCookieHeader(req.headers.cookie);
};

const getSessionFromSocket = (socket) => {
    return readSessionFromCookieHeader(socket.handshake.headers.cookie);
};

module.exports = {
    getSessionFromRequest,
    getSessionFromSocket,
    setSessionCookie,
    clearSessionCookie
};
