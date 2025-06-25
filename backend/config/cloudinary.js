const cloudinary = require("cloudinary").v2;

exports.connectCloudianry = async () => {
  try {
    await cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
    console.log("cloudinary connected successfully");
  } catch (error) {
    console.log("issue while connecting to the cloudinary => ", error);
  }
};
