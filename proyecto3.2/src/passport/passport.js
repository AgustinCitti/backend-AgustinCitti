//Importo passport
const passport = require("passport");
const Strategy = require("passport-local");

//Import bcrypt para encriptacion
const bcrypt = require("bcrypt");

//Persistencia de usuarios en Mongo Atlas
const Contenedor_Atlas = require("../contenedor/contenedor_Atlas/contenedor_Atlas.js");
const usuarios = new Contenedor_Atlas("../schemas/schemaUsuario.js");

//Registro
passport.use("register", new Strategy(async (username, password, done) => {
    const usuarioExiste = await usuarios.findByField("username", username);

    if (!usuarioExiste) {
        done(null, { username, password });
    }
    else {
        done(null, false);
    }
}));

//Login
passport.use("login", new Strategy(async (username, password, done) => {
    const usuarioExiste = await usuarios.findByField("username", username);

    if (usuarioExiste)
        bcrypt.compare(password, usuarioExiste.password, (error, res) => {
            if (error) throw error;
            if (res)
                done(null, usuarioExiste);
            else 
                done(null, false);
        })
    else
        done(null, false);
}));

//Serializar y deserealizar usuarios
passport.serializeUser((user, done) => {
    done(null, user.username);
})

passport.deserializeUser(async (username, done) => {
    const user = await usuarios.findByField("username", username);
    done(null, user);
})

module.exports = passport;