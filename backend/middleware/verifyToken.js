const admin = require("../config/firebase");

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "no token provided" });
  }

  try {
    const decodedtoken = await admin.auth().verifyIdToken(token);
    req.user = decodedtoken;
    next();
  } catch (error) {
    console.log("error verifying token: ", error);
    return res.status(403).json({ message: "Unauthorization" });
  }
};

module.exports = verifyToken;
