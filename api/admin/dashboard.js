const dbConnect = require("../../lib/dbConnect");
const Contact = require("../../models/Contact");
const Join = require("../../models/Join");
const { verifyToken } = require("../../lib/auth");
const { setupCors } = require("../../lib/cors");

module.exports = async function handler(req, res) {
  // ✅ إعدادات CORS - يجب أن تكون أول شيء
  if (setupCors(req, res)) {
    return; // Handle preflight request
  }

  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed. Use GET only.",
    });
  }

  try {
    await dbConnect();

    // التحقق من JWT token
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // التحقق من صحة الـ token
    const jwt = require("jsonwebtoken");
    const JWT_SECRET = process.env.JWT_SECRET || "royal-nano-secret-key-2024";

    const decoded = jwt.verify(token, JWT_SECRET);
    const Admin = require("../../models/Admin");
    const admin = await Admin.findById(decoded.adminId).select("-password");

    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: "Invalid token or admin not found.",
      });
    }

    // جلب البيانات
    const [contacts, joins] = await Promise.all([
      Contact.find({}).sort({ createdAt: -1 }).limit(50),
      Join.find({}).sort({ createdAt: -1 }).limit(50),
    ]);

    // إحصائيات
    const stats = {
      totalContacts: await Contact.countDocuments(),
      totalJoins: await Join.countDocuments(),
      recentContacts: await Contact.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),
      recentJoins: await Join.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),
    };

    res.status(200).json({
      success: true,
      message: "Dashboard data retrieved successfully",
      data: {
        admin: admin.toJSON(),
        stats,
        contacts,
        joins,
      },
    });
  } catch (error) {
    console.error("Dashboard data error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
