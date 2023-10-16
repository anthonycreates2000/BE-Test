const axios = require('axios');
const { getData } = require("../../app/controllers/exampleController");
const app = require("../../server.js");
const request = require("supertest")

jest.setTimeout(15000);

describe('test simple route hello', () => {
    afterEach((done) => {
      app.close();
      done();
    });
    test('should return a output from the endpoint', async () => {
        const expected_response = {
            message: 'Hello'
        }

        const response = await request(app)
            .get("/")
            .expect(200)

        expect(response.body).toEqual(expected_response);
    })
})

