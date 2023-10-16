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

describe('authenticateWithJWT', () => {
    it("Mmeberikan error 401 apabila header tidak terdefinisi.", () => {
      const req = {
        header: () => undefined,
      };
      const res = {
        status: (statusCode) => ({
          json: (data) => {
            assert.equal(statusCode, 401);
            assert.deepEqual(data, {
              message: "Authentication token is required.",
            });
          },
        }),
      };

      authenticatewithJWT(req, res, () => {});
    });
    it("Memberikan error 401 apabila token yang diberikan tidak sesuai.", () => {
        const req = {
          header: () => "invalidToken",
        };
        const res = {
          status: (statusCode) => ({
            json: (data) => {
              assert.equal(statusCode, 401);
              assert.deepEqual(data, { 
                message: "Invalid token." });
            },
          }),
        };
        
        sinon.stub(jwt, "verify").throws(new Error("Invalid token"));
        authenticatewithJWT(req, res, () => {});
        sinon.restore();
    });
})

describe("checkUserRole", () => {
    it("Memberikan error 403 apabila role user tidak sesuai.", () => {
        const req = {
            user: { role: "user" },
        };
        const res = {
            status: (statusCode) => ({
            json: (data) => {
                assert.equal(statusCode, 403);
                assert.deepEqual(data, {
                message:
                    "You do not have the required role to access this endpoint.",
                });
            },
            }),
        };
        const next = sinon.spy();

        const requiredRole = "admin";
        checkUserRole(requiredRole)(req, res, next);
        assert.isFalse(next.called);
    });
    it("Lanjut ke middleware berikutnya/ kode utama apabila role user yang diberikan sesuai.", () => {
      const req = {
        user: { role: "admin" },
      };
      const res = {};
      const next = sinon.spy();

      const requiredRole = "admin";

      checkUserRole(requiredRole)(req, res, next);

      assert.isTrue(next.calledOnce);
    });
})
