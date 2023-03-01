//dotenv para manejar variables de entorno
const dotenv = require("dotenv");
dotenv.config();

const options = {
    mysql: {
        client: 'mysql',
        connection: {
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DB
        },
        pool: { min: 0, max: 7 }
    },
    sqlite3: {
        client: 'sqlite3',
        connection: {
            filename: process.env.SQLITE3
        },
        useNullAsDefault: true
    },
    mongoAtlas: {
        connectionString: process.env.ATLAS
    }
};

module.exports = options;