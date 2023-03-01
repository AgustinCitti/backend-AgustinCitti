//Iniciar connection SQL
const initialize = require("./connection/initializeSQL.js");
initialize;

//Persistencia de mensajes y productos
const { sqlite3: configSQL } = require('./connection/options.js');
const Contenedor_SQL = require('./contenedor/contenedor_sql.js');
const mensajes = new Contenedor_SQL("mensajes", configSQL);
const productos = new Contenedor_SQL('productos', configSQL);

//yargs para setear puerto y modo por parametro
const yargs = require("yargs")(process.argv.slice());
const { puerto: PORT, modo: MODO } = yargs
    .alias({
        p: "puerto",
        m: "modo"
    })
    .default({
        puerto: 8080,
        modo: "FORK"
    })
    .argv;

const cluster = require("cluster");
const numCpu = require("os").cpus().length;

//Logger de Pino
const logger = require("./pino/logger.js");

if (cluster.isPrimary && MODO == "CLUSTER") {
    for (let i = 0; i < numCpu; i++) {
        cluster.fork();
    }
}
else {
    //Configuracion de servidor Express
    const express = require("express");
    const app = express();
    const { Server: HttpServer } = require("http");
    const { Server: ioServer } = require("socket.io");

    //Para poder usar JSON
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    //Compression
    const compression = require("compression");
    app.use(compression());

    //Configuracion de websockets
    const httpServer = new HttpServer(app);
    const io = new ioServer(httpServer);

    //Configuracion para sesiones de usuarios
    const cookieParser = require("cookie-parser");
    const session = require("express-session");
    const MongoStore = require("connect-mongo");
    const SECRET = 'secret';

    app.use(cookieParser());
    app.use(session({
        store: MongoStore.create({
            mongoUrl: "mongodb+srv://ezequiel:ezequiel@cluster0.v5hpbf0.mongodb.net/sessions?retryWrites=true&w=majority",
            mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
            ttl: 60
        }),
        secret: SECRET,
        resave: false,
        saveUninitialized: false
    }));

    const passport = require("passport");
    app.use(passport.initialize());
    app.use(passport.session());

    //Configuración de engine para render
    const path = require("path");
    app.set('views', path.join(__dirname, '../src/views'));
    app.set('view engine', 'ejs');

    //Importar rutas
    const routeAuth = require("./routers/auth.js");
    app.use(routeAuth);
    const routeApi = require("./routers/api.js");
    app.use(routeApi);
    const routeHome = require("./routers/home.js")
    app.use(routeHome);
    const routeInfo = require("./routers/info.js");
    app.use(routeInfo);
    const routeCarrito = require("./routers/carrito.js");
    app.use(routeCarrito);

    //Carpeta pública para fotos de perfil
    app.use("/images", express.static(path.resolve('./public/images')));

    app.get("*", (req, res)=>{
        logger.warn({msg: "Acceso a ruta invalida", route: req.params[0]});
        res.redirect("/");
    });

    //Levantar servidor en puerto PORT
    const server = httpServer.listen(PORT, () => {
        logger.warn({ msg: `Server escuchando en puerto ${server.address().port}` });
    })

    //Websockets
    io.on("connection", async (socket) => {
        logger.warn({ msg: "Nuevo cliente conectado." });

        /*Cuando hay un usuario nuevo se le envian 
        los productos y mensajes (normalizados)*/
        socket.emit("nuevo_cliente_productos", await productos.getAll());

        const getChatNormalizer = require("./normalizr/mensajes.js");
        socket.emit("nuevo_cliente_chat", getChatNormalizer(await mensajes.getAll()));

        /*Cuando se agrega un nuevo 
        usuario o mensaje se persiste*/
        socket.on("addProducto", (data) => {
            productos.save(data);
            io.sockets.emit("newProducto", data);
        });

        socket.on("addMensaje", (data) => {
            mensajes.save(data);
            io.sockets.emit("newMensaje", data);
        });
    });
}
