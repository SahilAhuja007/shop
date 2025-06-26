const express = require("express");
const { login } = require("../controller/adminController/auth");
const verifyToken = require("../../middleware/verifyToken");
const adminrouter = express.Router();

adminrouter.get("/login", verifyToken, login);

module.exports = adminrouter;
