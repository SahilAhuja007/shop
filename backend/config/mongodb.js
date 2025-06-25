const mongoose = require("mongoose");
require("dotenv").config();
exports.connectmongodb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("mongodb connected successfully!");
  } catch (error) {
    console.log("issue while connecting to the mongodb => ", error);
  }
};
