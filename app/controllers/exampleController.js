const axios = require("axios");
const WebSocket = require("ws");
const db = require("../models");
const Redis = require("ioredis");
const redis = new Redis();

const LIVE_THREAT_COUNT_DATA_KEY = "livethreat_count_data";
const LIVE_THREAT_MAP_URL = "https://livethreatmap.radware.com/api/map/attacks?limit=10";
// const Model = db.Model;
// const { Op } = require("sequelize");

exports.refactoreMe1 = (req, res) => {
  // function ini sebenarnya adalah hasil survey dri beberapa pertnayaan, yang mana nilai dri jawaban tsb akan di store pada array seperti yang ada di dataset

  TOTAL_NUMBER_OF_QUESTIONS = 10;
  // Pada code di bawah, terdapat query native PostgreSQL yang bertujuan untuk
  // melakukan rata-rata dari masing-masing nomor survey.
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
      SET dosurvey = True
      WHERE id = ${req.body.id}
    `);
    console.log(updateData);
  }
  catch(error){
    console.log(error);
  }

  res.status(201).send({
    statusCode: 201,
    message: "Survey sent successfully!",
    success: true,
    updateData,
  });
};

exports.callmeWebSocket = async (req, res) => {
  // do something
  try {
    const web_socket_server = await new WebSocket.Server({ noServer: true });
    const live_threat = await getLivethreatDataFromAPI();

    web_socket_server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(live_threat));
      }
    });
  } catch (error) {
    console.error(`Error fecthing data from live threat map: ${error}`);
  }
};

const getData = async (req, res) => {
  // do something

  COUNT_DESTINATION_COUNTRY = "count_destination_country";
  COUNT_SOURCE_COUNTRY = "count_source_country";

  const cached_attack_count_data = await getLivethreatRedisCache(
    COUNT_DESTINATION_COUNTRY,
    COUNT_SOURCE_COUNTRY
  );

  if (cached_attack_count_data) {
    res.status(201).send({
      statusCode: 201,
      success: true,
      data: {
        label: [COUNT_DESTINATION_COUNTRY, COUNT_SOURCE_COUNTRY],
        total: [
          parseInt(cached_attack_count_data[COUNT_DESTINATION_COUNTRY]),
          parseInt(cached_attack_count_data[COUNT_SOURCE_COUNTRY]),
        ],
      },
    });
  }

  let live_threat_queries = await getLivethreatDataQuery();
  await insertLivethreatDataToDatabase(live_threat_queries);

  try {
    const attack_count_data = await getThreatCountDataFromDatabase(
      COUNT_DESTINATION_COUNTRY,
      COUNT_SOURCE_COUNTRY
    );

    await save_livethreat_to_redis(attack_count_data);

    res.status(201).send({
      statusCode: 201,
      success: true,
      data: {
        label: [COUNT_DESTINATION_COUNTRY, COUNT_SOURCE_COUNTRY],
        total: [
          parseInt(attack_count_data[COUNT_DESTINATION_COUNTRY]),
          parseInt(attack_count_data[COUNT_SOURCE_COUNTRY]),
        ],
      },
    });
  } catch (error) {
    console.error(
      `Error fetching data destination and source country count data: ${error}`
    );
  }
};

const getLivethreatRedisCache = async () => {
  const livethreat_count_cached_data = await redis.get(
    LIVE_THREAT_COUNT_DATA_KEY
  );

  if (livethreat_count_cached_data === undefined || livethreat_count_cached_data === null) {
    console.log("Loading live threat count data from redis cache...");
    const attack_count_data = JSON.parse(livethreat_count_cached_data);
    return attack_count_data;
  }
  return null;
}

const getLivethreatDataFromAPI = async () => {
  const live_threats_response = await axios.get(LIVE_THREAT_MAP_URL);
  const live_threats = live_threats_response.data;
  return live_threats;
}

const getLivethreatDataQuery = async () => {
  let live_threat_queries = [];
  const live_threats = await getLivethreatDataFromAPI();

  const NULL = "NULL";
  live_threats.forEach((live_threat_per_batch) => {
    live_threat_per_batch.forEach((live_threat) => {
      const sourceCountry =
        live_threat["sourceCountry"] == null
          ? NULL
          : `'${live_threat["sourceCountry"]}'`;
      const destinationCountry =
        live_threat["destinationCountry"] == null
          ? NULL
          : `'${live_threat["destinationCountry"]}'`;
      const milisecond =
        live_threat["milisecond"] == null
          ? NULL
          : `'${live_threat["milisecond"]}'`;
      const type = `'${live_threat["type"]}'`;
      const weight = live_threat["weight"];
      const attackTime = `TO_TIMESTAMP('${live_threat["attackTime"]}', 'YYYY-MM-DDTHH:MI:SS')`;

      live_threat_values = [
        sourceCountry,
        destinationCountry,
        milisecond,
        type,
        weight,
        attackTime,
      ];

      live_threat_query = "(" + live_threat_values.toString() + ")";
      live_threat_queries.push(live_threat_query);
    });
  });
  return live_threat_queries;
}

const insertLivethreatDataToDatabase = async (live_threat_queries) => {
  try {
    live_threat_queries_in_string = live_threat_queries.toString();
    await db.sequelize.query(
      `INSERT INTO livethreat 
          ("sourceCountry", "destinationCountry", "milisecond",
          "type", "weight", "attackTime") VALUES ${live_threat_queries_in_string}`
    );
    console.log("Successfully insert all data to the database.");
  } catch (error) {
    console.error(`Error inserting data to livethreat: ${error}`);
  }
}

const getThreatCountDataFromDatabase = async (court_destination_country, court_source_country) => {
  let attack_count_data = await db.sequelize.query(
      `
        SELECT DISTINCT COUNT("destinationCountry") as ${court_destination_country},
        COUNT("sourceCountry") as ${court_source_country}
        FROM livethreat;
      `
    );

  attack_count_data = attack_count_data[0][0];
  return attack_count_data;
}

const save_livethreat_to_redis = async (attack_count_data) => {
  // Kode di bawah menunjukkan bahwa redis akan menyimpan data selama 15 menit.
  await redis.set(LIVE_THREAT_COUNT_DATA_KEY, JSON.stringify(attack_count_data), "EX", 900);
}

exports.getData = getData;
exports.getLivethreatRedisCache = getLivethreatRedisCache;
exports.getLivethreatDataFromAPI = getLivethreatDataFromAPI;
exports.getThreatCountDataFromDatabase = getThreatCountDataFromDatabase;
exports.insertLivethreatDataToDatabase = insertLivethreatDataToDatabase;
exports.save_livethreat_to_redis = save_livethreat_to_redis;