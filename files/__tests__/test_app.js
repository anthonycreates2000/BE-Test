const axios = require('axios');
const jwt = require("jsonwebtoken");
const { getData } = require("../../app/controllers/exampleController");
const app = require("../../server.js");
const request = require("supertest");
const authenticatewithJWT = require("../../app/middleware/authMiddleware");
const checkUserRole = require("../../app/middleware/roleMiddleware");
const chai = require("chai");
const sinon = require("sinon");
const { should } = require('chai');
const assert = chai.assert;

jest.setTimeout(30000);

COUNT_DESTINATION_COUNTRY = "count_destination_country";
COUNT_SOURCE_COUNTRY = "count_source_country";

describe('test simple route hello', () => {
    test('Mendapatkan message "Hello"', async () => {
        const expected_response = {
            message: 'Hello'
        }

        const response = await request(app)
            .get("/")
            .expect(200)

        expect(response.body).toEqual(expected_response);
    }); 
});

describe('test rute get livethreat attacks', () => {
    test("mendapatkan data livethreat attacks", async () => {
      const response = await request(app)
        .get("/api/data/get_livethreat_attacks")
        .expect(201);

      const response_data = response.data;

      console.log(`Response data: ${response_data}`);

      assert.deepEqual(response_data.label, [
        "court_destination_country",
        "court_source_country",
      ]);

      should.ok(Number.isSafeInteger(response_data.total[0]));
      should.ok(Number.isSafeInteger(response_data.total[1]));
    });
});

describe("test rute refactoreMe1", () => {
  test("mendapatkan nilai rata-rata dari semua 10 survey", async () => {
    const response = await request(app)
      .get("/api/data/get_average_per_survey")
      .expect(201);

    const response_data = response.data;

    console.log(`Response data: ${response_data}`);

    expect(response_data.length).equals(10);
  });
});