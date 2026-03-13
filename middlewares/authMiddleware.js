const jwt = require("jsonwebtoken");
const responseHelper = require("../helpers/responseHelper");
require("dotenv").config();

const auth = (req, res, next) => {
  const authHeaders = req.headers.authorization;
  if (!authHeaders) {
    return responseHelper.handleError(res, {
      status: 403,
      message: "Please login first!!",
    });
  }
  const token = authHeaders.split(" ")[1];
  const data = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, payload) => {
      if (err) {
        return responseHelper.handleError(res, err);
      }
      req.userId = payload.userId;
    },
  );
  console.log(data);

  next();
};

module.exports = auth;
