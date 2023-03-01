const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
    username: {type: String},
    password: {type: String},
    nombre: {type: String},
    direccion: {type: String},
    edad: {type: Number},
    phone: {type: Number}
})

module.exports = mongoose.model("usuarios", usuarioSchema);