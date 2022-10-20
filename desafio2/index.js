const Container = require("./container");

const products = new Container("./products.json");

products.save({ title: "Scottish", price: 300 });