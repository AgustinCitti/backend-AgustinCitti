const { Router } = require("express");
const routeCarrito = new Router();

//Persistencia de compras en Mongo Atlas
const Contenedor_Atlas = require("../contenedor/contenedor_Atlas/contenedor_Atlas.js");
const compras = new Contenedor_Atlas("../schemas/schemaCompra.js");

//dotenv para manejar variables de entorno
const dotenv = require("dotenv");
dotenv.config();

routeCarrito.get("/carrito", async (req, res) => {
    if (req.isAuthenticated())
        res.render("carrito", { productos: await compras.findManyByField("username", req.user.username) });
    else
        res.redirect("/login");
});

routeCarrito.post("/carrito", async (req, res) => {
    //Notificar al admin sobre un nuevo pedido
    const nodemailer = require("../helpers/nodemailer/nodemailer.js");
    const carrito = await compras.findManyByField("username", req.user.username);
    nodemailer.notificarCompra({ nombre: req.user.nombre, phone: req.user.phone, pedidos: carrito });

    const enviarSMS = require("../helpers/twilio/twilio.js");
    enviarSMS(`Pedido realizado con éxito.`, `+${req.user.phone}`);
    enviarSMS(`Nuevo pedido realizado por ${req.user.nombre}. Celular: +${req.user.phone}`, process.env.MOBILE_ADMIN);
    res.status(200).send(JSON.stringify({ res: "Compra realizada con éxito." }));
});

module.exports = routeCarrito;