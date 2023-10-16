const axios = require('axios');
const jwt = require("jsonwebtoken");
const { getData } = require("../../app/controllers/exampleController");
const app = require("../../server.js");
const request = require("supertest");
const authenticatewithJWT = require("../../app/middleware/authMiddleware");
const checkUserRole = require("../../app/middleware/roleMiddleware");
const chai = require("chai");
const sinon = require("sinon");
const assert = chai.assert;

jest.setTimeout(15000);

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
})
