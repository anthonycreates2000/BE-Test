const exampleController = require("../controllers/exampleController");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  const router = require("express").Router();

  router.get(
    "/get_average_per_survey",
    async (req, res) => { await exampleController.refactoreMe1(req, res); }
  );

  router.get(
    "/get_average_per_survey_websocket",
    (req, res) => {
      function convert_minutes_to_miliseconds(minutes) {
        return minutes * 60 * 1000;
      }
      setInterval(
        callmeWebSocket,
        convert_minutes_to_miliseconds((minutes = 3))
      );
    }
  );

  router.get(
    "/get_livethreat_attacks",
    exampleController.getData  
  );

  app.use("/api/data", router);
};
