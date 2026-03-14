const crypto = require("crypto");
const { connectDatabase } = require("../db/mongoClient");

const hashPassword = (password, salt = crypto.randomBytes(16).toString("hex")) => {
    const hash = crypto.scryptSync(password, salt, 64).toString("hex");
    return { hash, salt };
};

const validatePassword = (password, user) => {
    const attemptedHash = crypto.scryptSync(password, user.salt, 64).toString("hex");
    return crypto.timingSafeEqual(Buffer.from(user.hash, "hex"), Buffer.from(attemptedHash, "hex"));
};

const normalizeEmail = (email = "") => email.trim().toLowerCase();

const findUserByEmail = async (email) => {
    const { mode, db } = await connectDatabase();
    const normalized = normalizeEmail(email);

    if (mode === "mongo") {
        return db.collection("users").findOne({ email: normalized });
    }

    return db.users.get(normalized) || null;
};

const findUserById = async (id) => {
    const { mode, db } = await connectDatabase();

    if (mode === "mongo") {
        return db.collection("users").findOne({ id });
    }

    return [...db.users.values()].find((u) => u.id === id) || null;
};

const createUser = async ({ email, password, name }) => {
    const { mode, db } = await connectDatabase();
    const normalized = normalizeEmail(email);
    const now = new Date().toISOString();

    const userId = crypto.randomUUID();
    const passwordInfo = hashPassword(password);

    const user = {
        id: userId,
        email: normalized,
        name: name.trim(),
        hash: passwordInfo.hash,
        salt: passwordInfo.salt,
        settings: { theme: "classic" },
        createdAt: now,
        updatedAt: now
    };

    if (mode === "mongo") {
        await db.collection("users").insertOne(user);
    } else {
        db.users.set(normalized, user);
    }

    return user;
};

const updateUserSettings = async (id, updates) => {
    const { mode, db } = await connectDatabase();

    if (mode === "mongo") {
        await db.collection("users").updateOne(
            { id },
            {
                $set: {
                    "settings.theme": updates.theme,
                    name: updates.name,
                    updatedAt: new Date().toISOString()
                }
            }
        );
        return db.collection("users").findOne({ id });
    }

    const user = [...db.users.values()].find((u) => u.id === id);
    if (!user) return null;

    user.settings.theme = updates.theme;
    user.name = updates.name;
    user.updatedAt = new Date().toISOString();
    return user;
};

module.exports = {
    findUserByEmail,
    findUserById,
    createUser,
    updateUserSettings,
    validatePassword,
    normalizeEmail
};
