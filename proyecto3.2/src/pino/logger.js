const pino = require("pino");
const fs = require("fs");

const streams = [
    { stream: process.stdout },
    {
        level: "info",
        stream: fs.createWriteStream(__dirname + "/logs/info.log", { flags: "a" }),
    },
    {
        level: "warn",
        stream: fs.createWriteStream(__dirname + "/logs/warn.log", { flags: "a" }),
    },
    {
        level: "error",
        stream: fs.createWriteStream(__dirname + "/logs/error.log", { flags: "a" }),
    },
];

module.exports = pino(
    {
        level: "info",
    },
    pino.multistream(streams)
);