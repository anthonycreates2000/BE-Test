const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const secret_key = "secret-key";
  const jwt_token = jwt.sign(user, secret_key, { expiresIn: "1h" });
  return `Bearer ${jwt_token}`;
};

module.exports = generateToken;
