const mongoose = require("mongoose");

const compraSchema = new mongoose.Schema({
    title: {type: String},
    price: {type: Number},
    username: {type: String}
})

module.exports = mongoose.model("compras", compraSchema);