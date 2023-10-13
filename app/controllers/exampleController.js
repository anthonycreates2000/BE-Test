const axios = require("axios");
const WebSocket = require("ws");
const db = require("../models");
// const Model = db.Model;
// const { Op } = require("sequelize");

exports.refactoreMe1 = (req, res) => {
  // function ini sebenarnya adalah hasil survey dri beberapa pertnayaan, yang mana nilai dri jawaban tsb akan di store pada array seperti yang ada di dataset

  // CODE VERSI CHATGPT.
  // db.sequelize
  //   .query(
  //     `
  //       SELECT
  //         (SUM(values[1]::numeric) / 10) AS avg_index1,
  //         (SUM(values[2]::numeric) / 10) AS avg_index2,
  //         (SUM(values[3]::numeric) / 10) AS avg_index3,
  //         (SUM(values[4]::numeric) / 10) AS avg_index4,
  //         (SUM(values[5]::numeric) / 10) AS avg_index5,
  //         (SUM(values[6]::numeric) / 10) AS avg_index6,
  //         (SUM(values[7]::numeric) / 10) AS avg_index7,
  //         (SUM(values[8]::numeric) / 10) AS avg_index8,
  //         (SUM(values[9]::numeric) / 10) AS avg_index9,
  //         (SUM(values[10]::numeric) / 10) AS avg_index10
  //       FROM "surveys"
  //     `
  //   )
  //   .then((data) => {
  //     const totalIndex = [
  //       data[0][0].avg_index1,
  //       data[0][0].avg_index2,
  //       data[0][0].avg_index3,
  //       data[0][0].avg_index4,
  //       data[0][0].avg_index5,
  //       data[0][0].avg_index6,
  //       data[0][0].avg_index7,
  //       data[0][0].avg_index8,
  //       data[0][0].avg_index9,
  //       data[0][0].avg_index10,
  //     ];
  //     res.status(200).send({
  //       statusCode: 200,
  //       success: true,
  //       data: totalIndex,
  //     });
  //   });

  // CODE VERSI SAYA.
  TOTAL_NUMBER_OF_QUESTIONS = 10
  // Pada code di bawah, terdapat query native PostgreSQL yang bertujuan untuk
  // melakukan pe.
  db.sequelize
    .query(
      `
        SELECT
          (SUM(values[1]::numeric) / ${TOTAL_NUMBER_OF_QUESTIONS}) AS survey_score_question_1,
          (SUM(values[2]::numeric) / ${TOTAL_NUMBER_OF_QUESTIONS}) AS survey_score_question_2,
          (SUM(values[3]::numeric) / ${TOTAL_NUMBER_OF_QUESTIONS}) AS survey_score_question_3,
          (SUM(values[4]::numeric) / ${TOTAL_NUMBER_OF_QUESTIONS}) AS survey_score_question_4,
          (SUM(values[5]::numeric) / ${TOTAL_NUMBER_OF_QUESTIONS}) AS survey_score_question_5,
          (SUM(values[6]::numeric) / ${TOTAL_NUMBER_OF_QUESTIONS}) AS survey_score_question_6,
          (SUM(values[7]::numeric) / ${TOTAL_NUMBER_OF_QUESTIONS}) AS survey_score_question_7,
          (SUM(values[8]::numeric) / ${TOTAL_NUMBER_OF_QUESTIONS}) AS survey_score_question_8,
          (SUM(values[9]::numeric) / ${TOTAL_NUMBER_OF_QUESTIONS}) AS survey_score_question_9,
          (SUM(values[10]::numeric) / ${TOTAL_NUMBER_OF_QUESTIONS}) AS survey_score_question_10,
        FROM "surveys"
      `
    )
    .then((data) => {
      const survey_scores = [
        data[0][0].survey_score_question_1,
        data[0][0].survey_score_question_2,
        data[0][0].survey_score_question_3,
        data[0][0].survey_score_question_4,
        data[0][0].survey_score_question_5,
        data[0][0].survey_score_question_6,
        data[0][0].survey_score_question_7,
        data[0][0].survey_score_question_8,
        data[0][0].survey_score_question_9,
        data[0][0].survey_score_question_10,
      ];
      res.status(200).send({
        statusCode: 200,
        success: true,
        data: survey_scores,
      });
    });
};

exports.refactoreMe2 = async (req, res) => {
  // function ini untuk menjalakan query sql insert dan mengupdate field "dosurvey" yang ada di table user menjadi true,
  // jika melihat data yang di berikan, salah satu usernnya memiliki dosurvey dengan data false.

  console.log(req.body.userId)
  console.log(req.body.values)

  // Melakukan insert data ke table survey, dengan updatedAt dan createdAt pada hari ini.
  try {
    await db.sequelize.query(`
      INSERT INTO "surveys" ("userId", "updatedAt", "createdAt", "values")
      VALUES (${req.body.userId}, now(), now(), ${req.body.values})
    `);
  } 
  catch(error){
    console.log(err);
    res.status(500).send({
      statusCode: 500,
      message: "Cannot post survey.",
      success: false,
    });
  }

  try{
    const updateData = await db.sequelize.query(`
      UPDATE "surveys"
      SET dosurvey = False
      WHERE id = ${req.body.id}
    `)
    console.log(updateData)
  } 
  catch(error){
    console.log(error)
  }

  res.status(201).send({
    statusCode: 201,
    message: "Survey sent successfully!",
    success: true,
    updateData,
  });


  // Survey.create({
  //   userId: req.body.userId,
  //   values: req.body.values, // [] kirim array
  // })
  //   .then((data) => {
  //     User.update(
  //       {
  //         dosurvey: true,
  //       },
  //       {
  //         where: { id: req.body.id },
  //       }
  //     )
  //       .then(() => {
  //         console.log("success");
  //       })
  //       .catch((err) => console.log(err));

  //     res.status(201).send({
  //       statusCode: 201,
  //       message: "Survey sent successfully!",
  //       success: true,
  //       data,
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     res.status(500).send({
  //       statusCode: 500,
  //       message: "Cannot post survey.",
  //       success: false,
  //     });
  //   });
};

exports.callmeWebSocket = async (req, res) => {
  // do something
  try{
    const LIVE_THREAT_MAP_URL = "https://livethreatmap.radware.com/api/map/attacks?limit=10";
    const live_threat_response = await axios.get(LIVE_THREAT_MAP_URL);
    const web_socket_server = await new WebSocket.Server({ noServer: true });
    const live_threat_response_data = live_threat_response.data;

    web_socket_server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(live_threat_response_data));
      }
    });
  }
  catch(error){
    console.error(`Error fecthing data from live threat map: ${error}`);
  }
};

exports.getData = (req, res) => {
  // do something
};
