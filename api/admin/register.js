const dbConnect = require("../../lib/dbConnect");
const Admin = require("../../models/Admin");
const { generateToken } = require("../../lib/auth");
const { setupCors } = require("../../lib/cors");

module.exports = async function handler(req, res) {
  // ✅ إعدادات CORS - يجب أن تكون أول شيء
  if (setupCors(req, res)) {
    return; // Handle preflight request
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed. Use POST only.",
    });
  }

  try {
    await dbConnect();

    const { username, password, role = "admin" } = req.body;

    // التحقق من البيانات المطلوبة
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });
    }

    // التحقق من قوة كلمة المرور
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    // التحقق من وجود الإدمن
    const existingAdmin = await Admin.findOne({ username });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin with this username already exists.",
      });
    }

    // إنشاء الإدمن الجديد
    const admin = new Admin({
      username,
      password,
      role,
    });

    await admin.save();

    // إنشاء JWT token
    const token = generateToken(admin._id);

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: {
        admin: admin.toJSON(),
        token,
      },
    });
  } catch (error) {
    console.error("Admin registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
