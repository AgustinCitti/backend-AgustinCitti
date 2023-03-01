//Importo knex y options
const knex = require('knex');
const options = require('./options.js');

//Inicio conexiones sqlite3
const connectionSQL = knex(options.sqlite3);

//Crear tablas si no existen
(async () => {
    //Mensajes
    const existeTableMensajes = await connectionSQL.schema.hasTable('mensajes');
    if (!existeTableMensajes) {
        await connectionSQL.schema.createTable('mensajes', (table) => {
            table.increments('id').primary();
            table.string('mensaje', 256).notNullable();
            table.string('nombre', 256).notNullable();
            table.string('apellido', 256).notNullable();
            table.string('alias', 256).notNullable();
            table.string('avatar', 256).notNullable();
            table.string('email', 256).notNullable();
            table.integer("edad").notNullable();
        })
    }
    //Productos
    const existeTableProductos = await connectionSQL.schema.hasTable('productos');
    if (!existeTableProductos) {
        await connectionSQL.schema.createTable('productos', (table) => {
            table.increments('id').primary();
            table.string('title', 256).notNullable();
            table.string('thumbnail', 256).notNullable();
            table.integer('price').unsigned().notNullable();
        })
    }

    //Cierra conexión al finalizar
    connectionSQL.destroy();
})();

//Inicio conexiones Mongo Atlas
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);

(async () => {
    mongoose.connect(options.mongoAtlas.connectionString, { serverSelectionTimeoutMS: 5000, })
})();