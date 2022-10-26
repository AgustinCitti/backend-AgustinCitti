const express = require("express");
const Container = require("./container.js");
const products = new Container("products.txt");
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = app.listen(PORT, () => {
  console.log(
    `Servidor ehttp escuchando en puerto ${server.address().port}`
  );
});
server.on("error", (error) => console.log(`Error en servidor ${error}`));

app.get("/", (req, res) => {
  res.send(
    `<h1 style="text-align: center">Bienvenido a nueva entrega! </h1>`
  );
});

app.get("/products", (req, res) => {
  const ejecutar = async () => {
    try {
      const arrayProducts = await products.getAll();
      res.json(arrayProducts);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };
  ejecutar();
});

app.get("/random", (req, res) => {
  const ejecutar = async () => {
    try {
      const arrayProducts = await products.getAll();
      let numero = Math.floor(Math.random() * arrayProducts.length);
      let random = [];
      arrayProducts.map(
        (item, index) => index === numero && random.push(item)
      );
      res.json(random);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };
  ejecutar();
});