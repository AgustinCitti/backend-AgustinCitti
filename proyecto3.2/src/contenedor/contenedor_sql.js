//Importo knex
const knex = require('knex');

class Contenedor_SQL {
    constructor(table, options) {
        this.connection = knex(options);
        this.table = table;
    }

    async save(item) {
        await this.connection(this.table).insert(item);
    }

    async getById(id) {
        return await this.connection(this.table).where('id', id);
    }

    async getAll() {
        return await this.connection(this.table);
    }

    async deleteById(id) {
        await this.connection(this.table).del().where('id', id);
    }

    async deleteAll() {
        await this.connection(this.table).del();
    }
}

module.exports = Contenedor_SQL;