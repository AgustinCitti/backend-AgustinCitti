import express from "express";
import MATH from "clase37newpack";
const app = express();

app.get("/", (req, res) => {
  const { operation, a, b } = req.query;

  a === undefined ? res.send("a is undefined") : null;
  b === undefined ? res.send("b is undefined") : null;
  let aTemp = parseInt(a);
  let bTemp = parseInt(b);

  if (operation === "sum") {
    res.send(`The sum of ${aTemp} and ${bTemp} is ${MATH.sum(aTemp, bTemp)}`);
  } else if (operation === "rest") {
    res.send(`The rest of ${aTemp} and ${bTemp} is ${MATH.rest(aTemp, bTemp)}`);
  } else if (operation === "mult") {
    res.send(`The mult of ${aTemp} and ${bTemp} is ${MATH.mult(aTemp, bTemp)}`);
  } else if (operation === "div") {
    res.send(`The div of ${aTemp} and ${bTemp} is ${MATH.div(aTemp, bTemp)}`);
  } else {
    res.send("Operation not found");
  }
});

app.listen(3210, () => {
  console.log("Server running on port 3000");
});
