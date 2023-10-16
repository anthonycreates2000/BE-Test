const exampleController = require("../controllers/exampleController");
const authMiddleware = require("../middleware/authMiddleware")
const roleMiddleware = require("../middleware/roleMiddleware")

module.exports = (app) => {
    app.use((req, res, next) => {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });

    const router = require("express").Router();
    // Contoh penggunaan middleware autentikasi pada aplikasi.
    router.get(
      "/get_livethreat_attacks_authorized",
      authMiddleware.authenticatewithJWT,
      exampleController.getData
    );

    // Contoh penggunaan middleware pengecekan autentikasi, lalu cek role user pada aplikasi.
    router.get(
      "/get_livethreat_attacks_admin",
      authMiddleware.authenticatewithJWT,
      roleMiddleware.checkUserRole("admin"),
      exampleController.getData
    );

    app.use("/api/authentication", router);
}
