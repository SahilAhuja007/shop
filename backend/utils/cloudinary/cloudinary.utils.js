const cloudinary = require("cloudinary").v2;

exports.uploadToCloudinary = async (image) => {
  try {
    const result = await cloudinary.uploader.upload(image.tempFilePath, {
      folder: "images",
    });
    return result;
  } catch (error) {
    console.error("Issue while uploading to Cloudinary:", error.message);
    return null;
  }
};

exports.deleteFromCloudinary = async (imageUrl) => {
  try {
    const result = await cloudinary.uploader.destroy(imageUrl);
    return result;
  } catch (error) {
    console.log("issue while deleting from cloudinary :- ", error.message);
    return null;
  }
};
