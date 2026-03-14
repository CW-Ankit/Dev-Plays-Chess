const express = require("express");
const http = require("http");
const path = require("path");
const socketIo = require("socket.io");
const { createRouter } = require("./routes");
const { initializeGameSocket } = require("./sockets/gameSocket");
const { connectMongoose } = require("./db/mongoose");

const createAppServer = async () => {
    const app = express();
    const server = http.createServer(app);
    const io = socketIo(server);

    await connectMongoose();

    app.set("view engine", "ejs");
    app.use(express.static(path.join(__dirname, "../public")));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use(createRouter());
    initializeGameSocket(io);

    return { app, server };
};

module.exports = {
    createAppServer
};
