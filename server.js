const { createServer } = require("./src/app");

const PORT = Number(process.env.PORT) || 3000;

const start = async () => {
    const { server } = await createServer();
    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
};

start();
