import crypto from "crypto";
import { User } from "@chessdotcom/database";

// Mongoose handles connection buffering, so explicit assertion is usually not needed if connectDatabase is called at startup.

const hashPassword = (password, salt = crypto.randomBytes(16).toString("hex")) => {
    const hash = crypto.scryptSync(password, salt, 64).toString("hex");
    return { hash, salt };
};

export const validatePassword = (password, user) => {
    const attemptedHash = crypto.scryptSync(password, user.salt, 64).toString("hex");
    return crypto.timingSafeEqual(Buffer.from(user.hash, "hex"), Buffer.from(attemptedHash, "hex"));
};

export const normalizeEmail = (email = "") => email.trim().toLowerCase();

const mapUser = (userDoc) => {
    if (!userDoc) return null;

    return {
        id: userDoc.publicId,
        email: userDoc.email,
        name: userDoc.name,
        hash: userDoc.hash,
        salt: userDoc.salt,
        settings: userDoc.settings || { theme: "classic" }
    };
};

export const findUserByEmail = async (email) => {
    const normalized = normalizeEmail(email);
    const userDoc = await User.findOne({ email: normalized }).lean();
    return mapUser(userDoc);
};

export const findUserById = async (id) => {
    const userDoc = await User.findOne({ publicId: id }).lean();
    return mapUser(userDoc);
};

export const createUser = async ({ email, password, name }) => {
    const normalized = normalizeEmail(email);
    const passwordInfo = hashPassword(password);

    const userDoc = await User.create({
        publicId: crypto.randomUUID(),
        email: normalized,
        name: name.trim(),
        hash: passwordInfo.hash,
        salt: passwordInfo.salt,
        settings: { theme: "classic" }
    });

    return mapUser(userDoc.toObject());
};

export const updateUserSettings = async (id, updates) => {
    const userDoc = await User.findOneAndUpdate(
        { publicId: id },
        {
            $set: {
                name: updates.name,
                "settings.theme": updates.theme
            }
        },
        { new: true }
    ).lean();

    return mapUser(userDoc);
};
