const dotenv = require("dotenv");
dotenv.config();
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const client = require('twilio')(accountSid, authToken);
const logger = require("../../pino/logger.js");

const enviarSMS = async (mensaje, cel) => {
    try {
        await client.messages.create({
            body: mensaje,
            messagingServiceSid: 'MG5fef990abc9bea04790625f7e01854a7',
            to: cel
        })
        logger.info(`Mensaje enviado con éxito a ${cel}`);
    }
    catch(err) {
        logger.error(`Ocurrió un error al enviar el mensaje`);
    }
}

module.exports = enviarSMS;
