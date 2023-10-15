const jwt = require('jsonwebtoken');
const config = require('../config/auth');

const authenticatewithJWT = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication token is required." });
  }

  try {
    const user = jwt.verify(token, config.secret);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = authenticatewithJWT