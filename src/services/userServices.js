const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const {
  createAccessToken,
  generateOtp,
} = require("../../helpers/authHelper");
const redis = require("../config/redis");
const mailer = require("../config/mail");

const signUp = async (data) => {
  const { name, email, password } = data;
  const hassedPass = await bcrypt.hash(password, 10);
  const existingUser = await User.findOne({email}, {_id : 1})
  if(existingUser){
    throw new Error('User already exists')
  }
  const user = await User.create({ name, email, password: hassedPass });
  return {
    id: user._id,
  };
};

const login = async (data) => {
  const { email, password } = data;
  const user = await User.findOne(
    { email: email.toLowerCase() },
    { password: 1 },
  );
  if (!user) {
    throw new Error("User not found");
  }
  const result = await bcrypt.compare(password, user.password);
  if (!result) {
    throw new Error("Password incorrect");
  }

  const accessToken = createAccessToken(user.id);

  return {
    userId: user.id,
    accessToken,
  };
};

//refreshtoken expire from redis
const rotateToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Unauthorised Access!!");
  }

  return jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, payload) => {
      if (err) {
        throw new Error("Unauthorised");
      }

      const savedToken = await redis.get(payload.userId);
      if (!savedToken) {
        throw new Error("Session expired!");
      }

      const newAccessToken = createAccessToken(payload.userId);

      return {
        accessToken: newAccessToken,
      };
    },
  );
};

const logout = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Unauthorised access!!");
  }

  const data = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

  if (!data) {
    throw new Error("Login first");
  }

  return redis.del(data.userId);
};

const getUser = async (userId) => {
  return User.findById(userId);
};

const sendOtp = async (userEmail) => {
  try {
    const otp = generateOtp().toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    const user = await User.findOne(
      { email: userEmail.toLowerCase().trim() },
      { _id: 1 },
    );
    if (!user) {
      throw new Error("User does not exists!");
    }

    await redis.set(`otp:${userEmail.toLowerCase()}`, hashedOtp, {
      EX: 60 * 5,
    });

    await mailer.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Your One-Time Password (OTP) for Secure Login",
      html: `
        <div style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding:20px;">
          <div style="max-width:500px; margin:auto; background:#ffffff; padding:30px; border-radius:8px;">
            
            <h2 style="color:#333;">Secure Login Verification</h2>
            
            <p style="font-size:14px; color:#555;">
              Hello,
            </p>

            <p style="font-size:14px; color:#555;">
              Please use the One-Time Password (OTP) below to complete your login.
              This OTP is valid for <strong>5 minutes</strong>.
            </p>

            <div style="text-align:center; margin:30px 0;">
              <span style="font-size:28px; letter-spacing:6px; font-weight:bold; color:#2d89ef;">
                ${otp}
              </span>
            </div>

            <p style="font-size:13px; color:#777;">
              If you did not request this OTP, please ignore this email.
              Never share this code with anyone for security reasons.
            </p>

            <hr style="margin:25px 0;" />

            <p style="font-size:12px; color:#999;">
              This is an automated message. Please do not reply to this email.
            </p>

          </div>
        </div>
      `,
    });

    return true;
  } catch (error) {
  throw error;
}
};

const verifyOtp = async (body) => {
  const { otp, email } = body;

  const normalizedEmail = email.toLowerCase().trim();

  const verifiedOtp = await redis.get(`otp:${normalizedEmail}`);
  if (!verifiedOtp) {
    throw new Error("OTP expired!");
  }

  const isMatch = await bcrypt.compare(otp, verifiedOtp);
  if (!isMatch) {
    throw new Error("Incorrect OTP!");
  }

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    throw new Error("User not found");
  }

  user.emailVerified = true;
  await user.save();

  await redis.del(`otp:${normalizedEmail}`);

  return {
    message: "Email verified successfully",
  };
};

module.exports = {
  signUp,
  login,
  rotateToken,
  logout,
  getUser,
  sendOtp,
  verifyOtp,
};
