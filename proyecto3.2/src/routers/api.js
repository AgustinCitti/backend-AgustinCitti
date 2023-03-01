const { Router } = require("express");
const routeApi = new Router();
const { fork } = require("child_process");
const logger = require("../pino/logger.js");

routeApi.get("/api/productos-test", (req, res) => {
    logger.info({msg: "Acceso a ruta", route: "/api/productos-test"});
    const productosFaker = require("../api/productos.js");
    res.send(productosFaker);
})

routeApi.get("/api/randoms/", (req, res) => {
    logger.info({msg: "Acceso a ruta", route: "/api/randoms"});
    const cantidad = Number(req.query.cant) || 100000000;
    const random = fork("./src/api/randomNumbers.js");
    random.send(cantidad);
    random.on("message", (arr) => res.send(arr));
});

module.exports = routeApi;