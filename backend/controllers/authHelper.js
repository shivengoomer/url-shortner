const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const genToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
const verify = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {}
};
const check = async (req, res, next) => {
  let tk;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    tk = req.headers.authorization.split(" ")[1];
  }

  if (!tk) {
    return res.status(401).json({ message: "No token is there!" });
  }
  try {
    const userData = verify(tk);
    if (!userData) {
      return res.status(401).json({ message: "Issues with Token" });
    }
    req.user = await User.findById(userData.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "No authorization" });
  }
};

const checkAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }

  next();
};

const isAdmin = [check, checkAdmin];
const isAuthenticated = check;

module.exports = {
  check,
  checkAdmin,
  isAdmin,
  isAuthenticated,
  genToken,
  verify,
};
