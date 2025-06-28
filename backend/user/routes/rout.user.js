const express = require("express");
const { verifyToken } = require("../../middleware/verifyToken");
const {
  isFirstLogin,
  ApplicationForm,
  whattypeofuseritis,
} = require("../controller/userController/auth");
const userRouter = express.Router();

userRouter.get("/isFirstLogin", verifyToken, isFirstLogin);
userRouter.post("/applicationFrom", verifyToken, ApplicationForm);
userRouter.get("/userRole", verifyToken, whattypeofuseritis);

module.exports = userRouter;
