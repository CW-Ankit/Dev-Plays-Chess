const parsePort = (value, fallback) => {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const runtime = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: parsePort(process.env.SERVER_PORT || process.env.PORT, 3000),
    mongoUri: process.env.MONGO_URI || process.env.MONGODB_URI || "",
    mongoDbName: process.env.MONGO_DB_NAME || process.env.MONGODB_DB_NAME || "chessdotcom_clone",
    jwtSecret: process.env.JWT_SECRET || "dev-insecure-jwt-secret-change-me"
};

module.exports = {
    runtime
};
