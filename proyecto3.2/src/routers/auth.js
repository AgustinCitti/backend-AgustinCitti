const passport = require("../passport/passport.js");
const { Router } = require("express");
const routeAuth = new Router();
const logger = require("../pino/logger.js");
const bcrypt = require("bcrypt");

//Persistencia de usuarios en Mongo Atlas
const Contenedor_Atlas = require("../contenedor/contenedor_Atlas/contenedor_Atlas.js");
const usuarios = new Contenedor_Atlas("../schemas/schemaUsuario.js");

//Subir imagenes a servidor local
const multer = require("multer");
const path = require('path');

//Configuracion para multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public");
    },
    filename: (req, file, cb) => {
        cb(null, `/images/${req.body.username}_perfil${path.extname(file.originalname)}`);
    },
});
const upload = multer({ storage: storage });

//Raiz
routeAuth.get("/", (req, res) => {
    req.isAuthenticated()
        ?
        res.redirect("/home")
        :
        res.redirect("/login");
});

//Login
routeAuth.get("/login", (req, res) => {
    logger.info({ msg: "Acceso a ruta", route: "/login" });
    req.isAuthenticated()
        ?
        res.redirect("/home")
        :
        res.sendFile(process.cwd() + "/public/login.html");
});

routeAuth.post("/login", passport.authenticate("login", {
    successRedirect: "/home",
    failureRedirect: "/login-error"
}))

//Logout
routeAuth.get("/logout", async (req, res) => {
    logger.info({ msg: "Acceso a ruta", route: "/logout" });
    if (req.isAuthenticated()) {
        const usuario = req.user.username.toUpperCase();
        await req.session.destroy();
        res.render("logout", { usuario });
    }
    else {
        res.sendFile(process.cwd() + "/public/login.html");
    }
});

//Registro
routeAuth.get("/registro", (req, res) => {
    logger.info({ msg: "Acceso a ruta", route: "/registro" });
    req.isAuthenticated()
        ?
        res.redirect("/home")
        :
        res.sendFile(process.cwd() + "/public/registro.html");
});

routeAuth.post("/registro",
    upload.single('imagen'),
    passport.authenticate("register", { failureRedirect: "/registro-error" }),
    (req, res) => {
        const { password, username, nombre, direccion, edad, phone } = req.body;
        bcrypt.hash(password, 8, async (error, hash) => {
            if (error) throw error;
            const nuevoUsuario = { username, password: hash, nombre, direccion, edad, phone };
            await usuarios.save(nuevoUsuario);

            //Notificar al admin sobre un nuevo usuario
            const nodemailer = require("../helpers/nodemailer/nodemailer.js");
            nodemailer.notificarRegistro({ username, nombre, direccion, edad, phone });

            res.redirect("/home");
        })
    }
);

//Errores
routeAuth.get("/login-error", (req, res) => {
    logger.info({ msg: "Acceso a ruta", route: "/login.error" });
    res.sendFile(process.cwd() + "/public/login-error.html");
})

routeAuth.get("/registro-error", (req, res) => {
    logger.info({ msg: "Acceso a ruta", route: "/registro-error" });
    res.sendFile(process.cwd() + "/public/registro-error.html");
})

module.exports = routeAuth;