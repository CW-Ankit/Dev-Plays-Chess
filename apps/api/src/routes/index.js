import express from "express";
import {
    authRegister,
    authLogin,
    authLogout,
    getProfile,
    updateSettings,
    getGameHistory
} from "../controllers/authController.js";
import { getSessionFromRequest } from "../services/sessionService.js";
import { COLOR_PREF } from "../config/constants.js";

export const createRouter = () => {
    const router = express.Router();

    router.use((req, _res, next) => {
        req.sessionInfo = getSessionFromRequest(req);
        next();
    });

    router.get("/health", (req, res) => {
        res.json({ status: "ok" });
    });

    router.post("/api/auth/register", authRegister);
    router.post("/api/auth/login", authLogin);
    router.post("/api/auth/logout", authLogout);

    router.get("/api/user/profile", getProfile);
    router.put("/api/user/settings", updateSettings);
    router.get("/api/games/history", getGameHistory);

    return router;
};
