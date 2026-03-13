const responseHelper = require("../../helpers/responseHelper");
require("dotenv").config();
const userService = require("../services/userServices");
const { createRefreshToken } = require("../../helpers/authHelper");
const redis = require("../config/redis");

const signUp = async (req, res) => {
  try {
    const data = await userService.signUp(req.body);
    return responseHelper.handleSuccess(res, data);
  } catch (error) {
    return responseHelper.handleError(res, error);
  }
};

const login = async (req, res) => {
  try {
    const data = await userService.login(req.body);
    const refreshToken = await createRefreshToken(data.userId);

    await redis.set(data.userId, refreshToken, {
      EX: 60 * 60 * 24 * 7,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return responseHelper.handleSuccess(res, data);
  } catch (error) {
    return responseHelper.handleError(res, error);
  }
};

const rotateToken = async (req, res) => {
  try {
    const data = await userService.rotateToken(req.cookies.refreshToken);
    return responseHelper.handleSuccess(res, data);
  } catch (error) {
    error.status = 403;
    return responseHelper.handleError(res, error);
  }
};

const logout = async (req, res) => {
  try {
    await userService.logout(req.cookies.refreshToken);
    res.clearCookie("refreshToken");
    return responseHelper.handleOK(res);
  } catch (error) {
    error.status = 403;
    return responseHelper.handleError(res, error);
  }
};

const getUser = async (req, res) => {
  try {
    const data = await userService.getUser(req.userId);
    return responseHelper.handleSuccess(res, data);
  } catch (error) {
    return responseHelper.handleError(res, error);
  }
};

const sendOtp = async (req, res) => {
  try {
   await userService.sendOtp(req.body.email);
    return responseHelper.handleOK(res,201, 'Otp Sent Successfully');
  } catch (error) {
    return responseHelper.handleError(res, error);
  }
};

const verifyOtp = async (req, res) => {
  try {
   await userService.verifyOtp(req.body);
    return responseHelper.handleOK(res,201, 'Otp Verified Successfully');
  } catch (error) {
    return responseHelper.handleError(res, error);
  }
};

module.exports = {
  signUp,
  login,
  rotateToken,
  logout,
  getUser,
 sendOtp,
 verifyOtp
};