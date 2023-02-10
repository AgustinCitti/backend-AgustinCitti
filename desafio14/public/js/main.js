const socket = io.connect();
const AWS = require("aws-sdk");
//------------------------------------------------------------------------------------
AWS.config.update({
    region: "us-east-1",
  });
  const sns = new AWS.SNS();
const SNS_TOPIC_ARN = "arn:aws:sns:us-east-1:346155633151:notificaciones";
const dynamodb = new AWS.DynamoDB.DocumentClient();
const PORT = 8080;
const TABLE_NAME = "product-inventory";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    const params = {
      TableName: TABLE_NAME,
    };
    dynamodb
      .scan(params)
      .promise()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  });
  app.post("/productos", async (req, res) => {
    const params = {
      TableName: TABLE_NAME,
      Item: req.body,
    };
    try {
      await dynamodb.put(params).promise();
      console.log("se inserto");
      const prod = JSON.stringify(req.body);
      const data = await sns
        .publish({
          Message: `nuevo producto agregado! ${prod}`,
          TopicArn: SNS_TOPIC_ARN,
        })
        .promise();
      console.log("se NOTIFICO");
      console.log(data);
      const body = {
        Operation: "SAVE",
        Message: "SUCCESS",
        Item: req.body,
      };
      res.json(body);
    } catch (err) {
      console.log(err);
      const body = {
        Operation: "SAVE",
        Message: "No se pudo guardar",
        Item: req.body,
      };
      res.json(body);
    }
  });
const formAgregarProducto = document.getElementById('formAgregarProducto')
formAgregarProducto.addEventListener('submit', e => {
    e.preventDefault()
    const producto = {
        title: formAgregarProducto[0].value,
        price: formAgregarProducto[1].value,
        thumbnail: formAgregarProducto[2].value
    }
    socket.emit('update', producto);
    formAgregarProducto.reset()
})

socket.on('productos', productos => {
    makeHtmlTable(productos).then(html => {
        document.getElementById('productos').innerHTML = html
    })
});

function makeHtmlTable(productos) {
    return fetch('plantillas/tabla-productos.hbs')
        .then(respuesta => respuesta.text())
        .then(plantilla => {
            const template = Handlebars.compile(plantilla);
            const html = template({ productos })
            return html
        })
}

//-------------------------------------------------------------------------------------

// MENSAJES

/* --------------------- DESNORMALIZACIÓN DE MENSAJES ---------------------------- */
// Definimos un esquema de autor
const schemaAuthor = new normalizr.schema.Entity('author', {}, { idAttribute: 'id' });

// Definimos un esquema de mensaje
const schemaMensaje = new normalizr.schema.Entity('post', { author: schemaAuthor }, { idAttribute: '_id' })

// Definimos un esquema de posts
const schemaMensajes = new normalizr.schema.Entity('posts', { mensajes: [schemaMensaje] }, { idAttribute: 'id' })
/* ----------------------------------------------------------------------------- */

const inputUsername = document.getElementById('username')
const inputMensaje = document.getElementById('inputMensaje')
const btnEnviar = document.getElementById('btnEnviar')

const formPublicarMensaje = document.getElementById('formPublicarMensaje')
formPublicarMensaje.addEventListener('submit', e => {
    e.preventDefault()

    const mensaje = {
        author: {
            email: inputUsername.value,
            nombre: document.getElementById('firstname').value,
            apellido: document.getElementById('lastname').value,
            edad: document.getElementById('age').value,
            alias: document.getElementById('alias').value,
            avatar: document.getElementById('avatar').value
        },
        text: inputMensaje.value
    }

    socket.emit('nuevoMensaje', mensaje);
    formPublicarMensaje.reset()
    inputMensaje.focus()
})

socket.on('mensajes', mensajesN => {

    const mensajesNsize = JSON.stringify(mensajesN).length
    console.log(mensajesN, mensajesNsize);

    const mensajesD = normalizr.denormalize(mensajesN.result, schemaMensajes, mensajesN.entities)

    const mensajesDsize = JSON.stringify(mensajesD).length
    console.log(mensajesD, mensajesDsize);

    const porcentajeC = parseInt((mensajesNsize * 100) / mensajesDsize)
    console.log(`Porcentaje de compresión ${porcentajeC}%`)
    document.getElementById('compresion-info').innerText = porcentajeC

    console.log(mensajesD.mensajes);
    const html = makeHtmlList(mensajesD.mensajes)
    document.getElementById('mensajes').innerHTML = html;
})

function makeHtmlList(mensajes) {
    return mensajes.map(mensaje => {
        return (`
        <div>
            <b style="color:blue;">${mensaje.author.email}</b>
            [<span style="color:brown;">${mensaje.fyh}</span>] :
            <i style="color:green;">${mensaje.text}</i>
            <img width="50" src="${mensaje.author.avatar}" alt=" ">
        </div>
    `)
    }).join(" ");
}

inputUsername.addEventListener('input', () => {
    const hayEmail = inputUsername.value.length
    const hayTexto = inputMensaje.value.length
    inputMensaje.disabled = !hayEmail
    btnEnviar.disabled = !hayEmail || !hayTexto
})

inputMensaje.addEventListener('input', () => {
    const hayTexto = inputMensaje.value.length
    btnEnviar.disabled = !hayTexto
})
