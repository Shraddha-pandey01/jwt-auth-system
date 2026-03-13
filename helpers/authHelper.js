const jwt = require("jsonwebtoken");
require("dotenv").config();
const crypto = require('crypto')

const createAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const createRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

const generateOtp = () => {
return crypto.randomInt(100000, 1000000)
}

module.exports = {
  createAccessToken,
  createRefreshToken,
  generateOtp
};