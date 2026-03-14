const {
    findUserByEmail,
    createUser,
    validatePassword,
    updateUserSettings,
    findUserById,
    normalizeEmail
} = require("../repositories/userRepository");
const { listGamesForUser } = require("../repositories/gameRepository");
const { setSessionCookie, clearSessionCookie } = require("../services/sessionService");
const { COLOR_PREF } = require("../config/constants");

const sanitizePreference = (value) => {
    return Object.values(COLOR_PREF).includes(value) ? value : COLOR_PREF.RANDOM;
};

const asyncHandler = (handler) => async (req, res) => {
    try {
        await handler(req, res);
    } catch (error) {
        if (error.code === "DB_UNAVAILABLE") {
            return res.status(503).json({ message: "Database is unavailable. Please configure MongoDB." });
        }

        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

const authRegister = asyncHandler(async (req, res) => {
    const email = normalizeEmail(req.body.email || "");
    const password = req.body.password || "";
    const name = (req.body.name || "").trim();
    const preferredColor = sanitizePreference(req.body.preferredColor);

    if (!email || !password || password.length < 6 || !name) {
        return res.status(400).json({ message: "Name, valid email and password (min 6) are required." });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
        return res.status(409).json({ message: "Email already in use." });
    }

    const user = await createUser({ email, password, name });
    setSessionCookie(res, {
        userId: user.id,
        name: user.name,
        preferredColor,
        theme: user.settings.theme
    });

    return res.json({
        message: "Account created.",
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            preferredColor,
            theme: user.settings.theme
        }
    });
});

const authLogin = asyncHandler(async (req, res) => {
    const email = normalizeEmail(req.body.email || "");
    const password = req.body.password || "";
    const preferredColor = sanitizePreference(req.body.preferredColor);

    const user = await findUserByEmail(email);
    if (!user || !validatePassword(password, user)) {
        return res.status(401).json({ message: "Invalid credentials." });
    }

    setSessionCookie(res, {
        userId: user.id,
        name: user.name,
        preferredColor,
        theme: user.settings?.theme || "classic"
    });

    return res.json({
        message: "Welcome back.",
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            preferredColor,
            theme: user.settings?.theme || "classic"
        }
    });
});

const authLogout = asyncHandler(async (req, res) => {
    clearSessionCookie(res);
    return res.json({ message: "Logged out." });
});

const getProfile = asyncHandler(async (req, res) => {
    const userId = req.sessionInfo?.data?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await findUserById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    return res.json({
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            theme: user.settings?.theme || "classic",
            preferredColor: req.sessionInfo.data.preferredColor || COLOR_PREF.RANDOM
        }
    });
});

const updateSettings = asyncHandler(async (req, res) => {
    const userId = req.sessionInfo?.data?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const name = (req.body.name || "").trim();
    const theme = (req.body.theme || "classic").trim();
    const preferredColor = sanitizePreference(req.body.preferredColor);

    if (!name) return res.status(400).json({ message: "Name is required." });

    const user = await updateUserSettings(userId, { name, theme });
    if (!user) return res.status(404).json({ message: "User not found." });

    setSessionCookie(res, {
        userId: user.id,
        name: user.name,
        preferredColor,
        theme: user.settings?.theme || theme
    });

    return res.json({
        message: "Settings updated.",
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            theme: user.settings?.theme || theme,
            preferredColor
        }
    });
});

const getGameHistory = asyncHandler(async (req, res) => {
    const userId = req.sessionInfo?.data?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const games = await listGamesForUser(userId);
    return res.json({ games });
});

module.exports = {
    authRegister,
    authLogin,
    authLogout,
    getProfile,
    updateSettings,
    getGameHistory
};
