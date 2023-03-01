const { createTransport } = require("nodemailer");
const logger = require("../../pino/logger.js");

//dotenv para traer el mail del admin
const dotenv = require("dotenv");
const { array } = require("yargs");
dotenv.config();

const transporter = createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: process.env.USER_MAIL_FROM,
        pass: process.env.PASS_MAIL_FROM
    }
})

const notificarRegistro = async ({ username, nombre, direccion, edad, phone }) => {
    let cuerpoMensaje =      
        `
        <p>Nuevo usuario: ${username}</p>
        <p>Nombre: ${nombre}</p>
        <p>Direccion: ${direccion}</p>
        <p>Edad: ${edad}</p>
        <p>Number: ${phone}</p>
        `
    try {
        await transporter.sendMail({
            to: process.env.MAIL_ADMIN,
            subject: "Nuevo registro",
            html: cuerpoMensaje
        });
        logger.info("Nuevo usuario agregado al sistema");
    }
    catch (err) {
        logger.error(err);
    }
};

const notificarCompra = async ({ nombre, phone, pedidos }) => {
    let listaPedidos = "";
    pedidos.forEach(pedido => {
        listaPedidos+="<li>"+pedido.title+"</li>";
    });

    let cuerpoMensaje =      
        `
        <p>Nombre: ${nombre}</p>
        <p>Celular: ${phone}</p>
        <p>Lista Pedidos: </p>
        <ul>
            ${listaPedidos}
        </ul>
        `
    try {
        await transporter.sendMail({
            to: process.env.MAIL_ADMIN,
            subject: "Nuevo pedido",
            html: cuerpoMensaje
        });
        logger.info("Nuevo usuario agregado al sistema");
    }
    catch (err) {
        logger.error(err);
    }
};

module.exports = { notificarRegistro, notificarCompra };