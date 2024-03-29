const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

const corsOptions = {
  origin: ["http://localhost:8080"],
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// database
const db = require("./app/models");

db.sequelize.sync();

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Hello" });
});

// routes
require("./app/routes/dataRoutes")(app);
require("./app/routes/authenticationRoutes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 7878;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = app