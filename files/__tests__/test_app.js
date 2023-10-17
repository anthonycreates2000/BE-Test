const app = require("../../server.js");
const request = require("supertest");
const chai = require("chai");

jest.setTimeout(100000);

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
      await request(app)
        .get("/api/data/get_livethreat_attacks")
        .expect(201)
        .then((response) => {
          const { success, data } = response.body;
          const response_data = data;

          console.log(response_data)

          expect(success).toEqual(true);

          expect(response_data.label[0]).toEqual("count_destination_country");
          expect(response_data.label[1]).toEqual("count_source_country");
          expect(typeof response_data.total[0]).toEqual("number");
          expect(typeof response_data.total[1]).toEqual("number");
        });
    });
});

describe("test rute refactoreMe1", () => {
  test("mendapatkan nilai rata-rata dari semua 10 survey", async () => {
    const response = await request(app)
      .get("/api/data/get_average_per_survey")
      .expect(200);

    const response_data = response.data;

    console.log(`Response data: ${response_data}`);

    expect(response_data.length).equals(10);
  });
});