const { Chess } = require("chess.js");

const chess = new Chess();

const players = {
    white: null,
    black: null
};

const resetSeatBySocket = (socketId) => {
    if (players.white?.socketId === socketId) {
        players.white = null;
    }

    if (players.black?.socketId === socketId) {
        players.black = null;
    }
};

const resetSeatByUsername = (username) => {
    if (players.white?.username === username) {
        players.white = null;
    }

    if (players.black?.username === username) {
        players.black = null;
    }
};

module.exports = {
    chess,
    players,
    resetSeatBySocket,
    resetSeatByUsername
};
