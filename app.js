const express = require("express")
const morgan = require("morgan");
const bodyParser = require("body-parser")
const router = require("./routes");

const app = express()

app.use(morgan("dev"))
app.use(express.json())
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(router);

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "Welcome to the Lendsqr application!", app: "Lendsqr" });
});

module.exports = app