const router = require("express").Router();
const auth = require('../middlewares/authMiddleware')
const userController = require("../src/controllers/userController");
const { userSchema } = require('../src/validations/userValidations')
const{ validate } = require('../middlewares/userMiddleware')
const { verifyOtpRateLimiter } = require('../middlewares/otpRateLimit')

router.post("/sign-up", validate(userSchema), userController.signUp);
router.post("/login", userController.login);
router.get("/refresh", userController.rotateToken);
router.delete("/logout", auth, userController.logout);

router.get("/", auth, userController.getUser);
router.post("/getotp", userController.sendOtp);

router.post("/verify", verifyOtpRateLimiter, userController.verifyOtp);

module.exports = router;
