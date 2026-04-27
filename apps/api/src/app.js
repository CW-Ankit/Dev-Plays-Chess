import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { createRouter } from "./routes/index.js";
import { initializeGameSocket } from "./sockets/gameSocket.js";
import { connectDatabase } from "@chessdotcom/database";
import { runtime } from "./config/runtime.js";

export const createAppServer = async () => {
    const app = express();
    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: ["http://localhost:5173", "http://localhost:5174"],
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true
        }
    });

    await connectDatabase(runtime.mongoUri);

    app.use(cors({ 
        origin: ["http://localhost:5173", "http://localhost:5174"], 
        credentials: true 
    }));

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use(createRouter());
    initializeGameSocket(io);

    return { app, server };
};
