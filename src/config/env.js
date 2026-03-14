const toNumber = (value, fallback) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const env = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: toNumber(process.env.SERVER_PORT || process.env.PORT, 3000),
    mongoUri: process.env.MONGO_URI || process.env.MONGODB_URI || "",
    mongoDbName: process.env.MONGO_DB_NAME || process.env.MONGODB_DB_NAME || "chessdotcom_clone"
};

module.exports = {
    env
};
