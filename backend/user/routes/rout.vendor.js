const express = require("express");
const {
  isFirstLogin,
  ApplicationForm,
} = require("../controller/vendorController/auth");
const verifyToken = require("../../middleware/verifyToken");
const vendorrouter = express.Router();

vendorrouter.get("/isFirstLogin", verifyToken, isFirstLogin);
vendorrouter.post("/applicationFrom", verifyToken, ApplicationForm);

module.exports = vendorrouter;
