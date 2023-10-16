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

jest.setTimeout(15000);

COUNT_DESTINATION_COUNTRY = "count_destination_country";
COUNT_SOURCE_COUNTRY = "count_source_country";

describe('test simple route hello', () => {
    test('should return a output from the endpoint', async () => {
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
        .get("get_livethreat_attacks")
        .expect(201);

      const response_data = response.data;

      assert.deepEqual(response_data.label, [
        "court_destination_country",
        "court_source_country",
      ]);

      should.ok(Number.isSafeInteger(response_data.total[0]));
      should.ok(Number.isSafeInteger(response_data.total[1]));
    });
});

describe('tes rute refactorMe1', () => {
    test("mendapatkan nilai rata-rata dari 10 survey masing-masing user yang diberikan", async () => {
      const response = await request(app)
        .get("get_livethreat_attacks")
        .expect(201);

      const response_data = response.data;

      assert.deepEqual(response_data.label, [
        "court_destination_country",
        "court_source_country",
      ]);

      should.ok(Number.isSafeInteger(response_data.total[0]));
      should.ok(Number.isSafeInteger(response_data.total[1]));
    });
});
