const logger = require("../pino/logger.js");

class RandomNumber {
    constructor(cant) {
        this.numbers = {};
        for(let i=0; i<cant; i++){
            const random = Math.ceil(Math.random()*10);
            this.numbers[random] ? this.numbers[random]++ : this.numbers[random]=1;
        }
    };
}

process.on("message", (cant) => {
    try {
        const random = new RandomNumber(cant);
        process.send(random.numbers);
    } catch (error) {
        logger.error("Error al ejecutar la API de mensajes");
    }
});