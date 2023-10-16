const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const authenticatewithJWT = require("./app/middleware/authMiddleware");
const checkUserRole = require("./app/middleware/roleMiddleware");
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
const { callmeWebSocket, getData, refactoreMe1 } = require("./app/controllers/exampleController");

db.sequelize.sync();

// never enable the code below in production
// force: true will drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and Resync Database with { force: true }");
//   // initial();
// });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Hello" });
});

// app.get("/websocket", (req, res) => {
//   function convert_minutes_to_miliseconds(minutes){
//       return minutes * 60 * 1000
//   }
//   setInterval(
//     callmeWebSocket,
//     convert_minutes_to_miliseconds(minutes = 3)
//   );
// })

// app.get("/get_livethreat_attacks", async (req, res) => {
//   await getData(req, res);
// })

// app.get("/get_average_per_survey", async (req, res) => {
//   await refactoreMe1(req, res);
// })

// routes
require("./app/routes/dataRoutes")(app);
require("./app/routes/authenticationRoutes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 7878;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = app