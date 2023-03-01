//Normalizr
const { normalize, schema } = require('normalizr');

//Schemas para normalizar
const autorSchema = new schema.Entity('autor', {}, { idAttribute: 'email' });

const mensajeSchema = new schema.Entity('post', {
    autor: autorSchema
}, { idAttribute: 'id' });

const mensajesSchema = new schema.Entity('posts', {
    mensajes: [mensajeSchema]
}, { idAttribute: 'id' });

//Metodo para normalizar mensajes
const getChatNormalizer =  (mensajes) => {
    return normalize({
        id: 'mensajes',
        mensajes: mensajes,
    }, mensajesSchema);
};

module.exports = getChatNormalizer;