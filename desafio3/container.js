const fs = require("fs");

class Container {
    constructor(archive) {
        this.archive = archive;
    }

    exists(archive) {
        try {
            if (!fs.existsSync(archive)) {
                throw new Error("El archivo solicitado no existe");
            } else {
                return true;
            }
        } catch (error) {
            console.log(`Error buscando el archivo solicitado: ${error.message}`);
        }
    }

    async readFile(archive) {
        try {
            const data = await fs.readFileSync(archive);
            return JSON.parse(data);
        } catch (error) {
            console.log(`Error leyendo el archivo solicitado: ${error.message}`);
        }
    }

    async writeFile(archive, content) {
        try {
            await fs.writeFileSync(archive, JSON.stringify(content, null, 4));
        } catch (error) {
            console.log(`Error escribiendo el archivo: ${error.message}`);
        }
    }

    async save(product) {
        try {
            if (!this.exists(this.archive)) {
                console.log(`Se procede a crear datos nuevos`);
                let arrayProducts = [];
                product = { id: 1, ...product };
                arrayProducts.push(product);
                console.log(`Agregando producto...`);
                await fs.writeFile(this.archive, arrayProducts);
                console.log(
                    `Se agrego el producto nuevo con el siguiente id: ${product.id}`
                );
                return product.id;
            } else {
                if (this.readFile(this.archive)) {
                    console.log(`Leyendo archivo...`);
                    const data = await this.readFile(this.archive);
                    if (data.length === 0) {
                        product = { id: 1, ...product };
                    } else {
                        let lastId = data[data.length - 1].id;
                        product = { id: lastId + 1, ...product };
                    }
                    console.log(`Agregando producto al archivo...`);
                    data.push(product);
                    this.writeFile(this.archive, data);
                    console.log(
                        `Se agrego el nuevo producto con el id: ${product.id}`
                    );
                    return product.id;
                }
            }
        } catch (error) {
            console.log(`Error agregando el producto: ${error.message}`);
        }
    }

    async getById(id) {
        try {
            if (this.exists(this.archive)) {
                const data = await this.readFile(this.archive);
                const dataId = data.filter(item => item.id === id);
                if (dataId.length === 0) {
                    throw new Error(
                        "No se encontro un producto con el id solicitado"
                    );
                } else {
                    console.log(`Producto con id ${id} encontrado:\n`, dataId);
                    return dataId;
                }
            }
        } catch (error) {
            console.log(`Error buscando producto con el id: ${error.message}`);
        }
    }

    async getAll() {
        try {
            if (this.exists(this.archive)) {
                console.log(`Leyendo archivo...`);
                const data = await this.readFile(this.archive);
                if (data.length !== 0) {
                    console.log(`Archivo con contenido:`);
                    console.log(data);
                    return data;
                } else {
                    throw new Error(`El archivo ${this.archive} esta vacio`);
                }
            }
        } catch (error) {
            console.log(
                `Error obteniendo todos los productos: ${error.message}`
            );
        }
    }

    async deleteById(id) {
        try {
            if (this.exists(this.archive)) {
                const data = await this.readFile(this.archive);
                console.log(`Buscando producto con el id solicitado...`);
                if (data.some(item => item.id === id)) {
                    const data = await this.readFile(this.archive);
                    console.log(`Eliminando producto con id solicitado...`);
                    const datos = data.filter(item => item.id !== id);
                    this.writeFile(this.archive, datos);
                    console.log(`Producto con el id ${id} eliminado`);
                } else {
                    throw new Error(
                        `No se encontro el producto con el id ${id}`
                    );
                }
            }
        } catch (error) {
            console.log(
                `Ocurrio un error eliminando el producto con el id solicitado: ${error.message}`
            );
        }
    }

    async deleteAll() {
        try {
            let nuevoArray = [];
            console.log(`Borrando datos...`);
            await this.writeFile(this.archive, nuevoArray);
            console.log(
                `Se borraron todos los datos del archivo ${this.archive}`
            );
        } catch (error) {
            console.log(
                `Ocurrio un error eliminando los datos: ${error.message}`
            );
        }
    }
}

module.exports = Container;