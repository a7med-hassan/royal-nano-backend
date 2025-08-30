const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const JWT_SECRET = process.env.JWT_SECRET || "royal-nano-secret-key-2024";

// إنشاء JWT token
const generateToken = (adminId) => {
  return jwt.sign({ adminId }, JWT_SECRET, {
    expiresIn: "7d", // 7 أيام
  });
};

// التحقق من JWT token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(decoded.adminId).select("-password");

    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: "Invalid token or admin not found.",
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid token.",
    });
  }
};

// التحقق من صلاحيات Super Admin
const requireSuperAdmin = (req, res, next) => {
  if (req.admin.role !== "super_admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Super admin privileges required.",
    });
  }
  next();
};

module.exports = {
  generateToken,
  verifyToken,
  requireSuperAdmin,
};
