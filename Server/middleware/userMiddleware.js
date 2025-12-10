const jwt = require("jsonwebtoken");
const User = require("../models/User.model.js");


module.exports = async (req, res, next) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    const token = req.cookies.token;

    if (!token) {
      console.log("Authentication failed: No token in cookies");
      return res.status(401).json({ message: "Token missing" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      console.log("Authentication failed: User not found for ID:", decoded.userId);
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log("Authentication failed:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};
