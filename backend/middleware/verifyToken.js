const admin = require("../config/firebase");
const User = require("../user/models/user.model");

exports.verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decodedtoken = await admin.auth().verifyIdToken(token);
    req.user = decodedtoken;
    next();
  } catch (error) {
    console.log("Error verifying token: ", error);
    return res.status(403).json({ message: "Unauthorized" });
  }
};

exports.authorization = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      const existinguser = await User.findOne({ email: user.email });

      if (!existinguser) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      if (allowedRoles.includes(existinguser.role)) {
        req.user = existinguser;
        return next();
      } else {
        return res.status(403).json({
          success: false,
          message: "Access denied, not authorized",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Issue verifying role",
        data: error.message,
      });
    }
  };
};

exports.adminvendorAccess = (requiredAccess) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      const existinguser = await User.findOne({ email: user.email });

      if (!existinguser) {
        return res
          .status(400)
          .json({ success: false, message: "User not found" });
      }

      if (existinguser.role === "admin") {
        req.user = existinguser;
        return next();
      }

      if (existinguser.role === "vendor") {
        if (existinguser.access === requiredAccess) {
          req.user = existinguser;
          return next();
        } else {
          return res.status(403).json({
            success: false,
            message: `Access denied. You need "${requiredAccess}" permission. Contact admin.`,
          });
        }
      }

      return res.status(401).json({
        success: false,
        message:
          "Access denied. This route is restricted to admin and vendors.",
      });
    } catch (error) {
      console.log("Issue while checking access: ", error.message);
      return res.status(500).json({
        success: false,
        message: "Server error while checking admin/vendor access",
        data: error.message,
      });
    }
  };
};
