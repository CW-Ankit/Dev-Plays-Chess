import dotenv from "dotenv";
dotenv.config();

export const runtime = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || "development",
    mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/chessgame",
    jwtSecret: process.env.JWT_SECRET || "supersecret"
};
