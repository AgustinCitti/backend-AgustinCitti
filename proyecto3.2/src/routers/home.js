const { Router } = require("express");
const routeHome = new Router();
const logger = require("../pino/logger.js");

//Persistencia de compras en Mongo Atlas
const Contenedor_Atlas = require("../contenedor/contenedor_Atlas/contenedor_Atlas.js");
const compras = new Contenedor_Atlas("../schemas/schemaCompra.js");

routeHome.get("/home", (req, res) => {
    logger.info({ msg: "Acceso a ruta", route: "/home" });
    req.isAuthenticated()
        ?
        res.render("home",
            {
                usuario: req.user.username.toUpperCase(),
                perfil: `http://localhost:${req.socket.localPort}/images/${req.user.username}_perfil.webp`
            })
        :
        res.redirect("/login");
});

routeHome.post("/home", async (req, res) => {
    if (req.isAuthenticated()) {
        const { title, price } = req.body;
        const { username } = req.user;
        try {
            compras.save({ title, price, username });
            res.status(200).send(JSON.stringify({ res: "Producto agregado con éxito." }));
        }
        catch (err) {
            res.status(400).send(JSON.stringify({ res: "Ocurrió un error al agregar el producto." }));
        }
    }
    else
        res.redirect("/login");
})

module.exports = routeHome;