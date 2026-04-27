import { createAppServer } from "./src/app.js";
import { runtime } from "./src/config/runtime.js";

const startServer = async () => {
    try {
        const { server } = await createAppServer();

        server.listen(runtime.port, () => {
            console.log(`Listening on port ${runtime.port} (${runtime.nodeEnv})`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
