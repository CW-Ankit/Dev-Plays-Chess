const express = require("express");
const http = require("http");
const path = require("path");
const socket = require("socket.io");
const { createRouter } = require("./routes");
const { initializeGameSocket } = require("./sockets/gameSocket");

const createServer = () => {
    const app = express();
    const server = http.createServer(app);
    const io = socket(server);

    app.set("view engine", "ejs");
    app.use(express.static(path.join(__dirname, "../public")));
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    app.use(createRouter());
    initializeGameSocket(io);

    return { app, server };
};

module.exports = {
    createServer
};
