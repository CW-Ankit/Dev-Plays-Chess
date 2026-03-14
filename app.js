const { createServer } = require("./src/server");

const defineServer = async () => {
    return createServer();
};

module.exports = {
    defineServer
};
