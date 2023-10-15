const axios = require('axios');
const { getData } = require("../../app/controllers/exampleController");
const app = require("../../server.js");
const request = require("supertest")

jest.setTimeout(30000);

describe('test simple route hello', () => {
    test('should return a output from the endpoint', async () => {
        const expected_response = {
            message: 'Hello'
        }

        const response = await request(app)
            .get("/")
            .expect(200)

        expect(response.body).toEqual(expected_response);
    })

    test('', async () => {
        getThreatCountDataFromDatabase;
        expect(response.body).toEqual(expected_response);
    })
})

