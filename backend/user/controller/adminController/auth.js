const User = require("../../models/user.model");

exports.login = async (req, res) => {
  try {
    const user = req.user;

    const existingAdmin = await User.findOne({ email: user.email });

    if (!existingAdmin || existingAdmin.role !== "admin") {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. You're not registered as an admin. Contact your head.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      data: existingAdmin,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Issue while processing admin login",
      error: error.message,
    });
  }
};
