const mongoose = require("mongoose");
const { runtime } = require("../config/runtime");

let isConnected = false;

const connectMongoose = async () => {
    if (!runtime.mongoUri) {
        console.warn("[db] MONGO_URI/MONGODB_URI not set. Database-backed features will be unavailable.");
        return null;
    }

    if (mongoose.connection.readyState === 1) {
        isConnected = true;
        return mongoose.connection;
    }

    try {
        await mongoose.connect(runtime.mongoUri, {
            dbName: runtime.mongoDbName,
            autoIndex: true,
            serverSelectionTimeoutMS: 5000
        });

        isConnected = true;
        return mongoose.connection;
    } catch (error) {
        isConnected = false;
        console.warn(`[db] MongoDB connection failed: ${error.message}`);
        return null;
    }
};

const assertDatabaseConnection = () => {
    if (!isConnected) {
        const error = new Error("Database is not connected.");
        error.code = "DB_UNAVAILABLE";
        throw error;
    }
};

module.exports = {
    connectMongoose,
    assertDatabaseConnection
};
