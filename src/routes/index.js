const express = require("express");
const {
    authRegister,
    authLogin,
    authLogout,
    getProfile,
    updateSettings,
    getGameHistory
} = require("../controllers/authController");
const { getSessionFromRequest } = require("../services/sessionService");
const { COLOR_PREF } = require("../config/constants");

const createRouter = () => {
    const router = express.Router();

    router.use((req, _res, next) => {
        req.sessionInfo = getSessionFromRequest(req);
        next();
    });

    router.get("/", (req, res) => {
        const user = req.sessionInfo?.data || null;

        res.render("index", {
            title: "Chess.com Clone",
            initialUser: user
                ? {
                      id: user.userId,
                      name: user.name,
                      preferredColor: user.preferredColor || COLOR_PREF.RANDOM,
                      theme: user.theme || "classic"
                  }
                : null
        });
    });

    router.post("/api/auth/register", authRegister);
    router.post("/api/auth/login", authLogin);
    router.post("/api/auth/logout", authLogout);

    router.get("/api/user/profile", getProfile);
    router.put("/api/user/settings", updateSettings);
    router.get("/api/games/history", getGameHistory);

    return router;
};

module.exports = {
    createRouter
};
