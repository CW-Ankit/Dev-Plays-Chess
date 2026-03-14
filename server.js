const { defineServer } = require("./app");
const { env } = require("./src/config/env");

const start = async () => {
    try {
        const { server } = await defineServer();
        server.listen(env.port, () => {
            console.log(`Listening on port ${env.port} (${env.nodeEnv})`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

start();
