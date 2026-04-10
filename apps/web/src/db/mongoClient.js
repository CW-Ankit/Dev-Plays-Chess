let MongoClientCtor = null;

try {
    ({ MongoClient: MongoClientCtor } = require("mongodb"));
} catch (error) {
    MongoClientCtor = null;
}

let client = null;
let db = null;

const memoryDb = {
    users: new Map(),
    games: []
};

const connectDatabase = async () => {
    const mongoUri = process.env.MONGO_URI;
    const dbName = process.env.MONGO_DB_NAME || "chessdotcom_clone";

    if (!MongoClientCtor || !mongoUri) {
        return { mode: "memory", db: memoryDb };
    }

    if (!client) {
        client = new MongoClientCtor(mongoUri);
        await client.connect();
        db = client.db(dbName);
    }

    return { mode: "mongo", db };
};

module.exports = {
    connectDatabase,
    memoryDb
};
