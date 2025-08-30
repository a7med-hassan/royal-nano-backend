const dbConnect = require("../../lib/dbConnect");
const Admin = require("../../models/Admin");
const { generateToken } = require("../../lib/auth");

module.exports = async function handler(req, res) {
  // إعدادات CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma"
  );

  // معالجة preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed. Use POST only.",
    });
  }

  try {
    await dbConnect();

    const { username, password } = req.body;

    // التحقق من البيانات المطلوبة
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });
    }

    // البحث عن الإدمن
    const admin = await Admin.findOne({ username }).select("+password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    // التحقق من حالة الإدمن
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated.",
      });
    }

    // التحقق من كلمة المرور
    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    // تحديث آخر دخول
    admin.lastLogin = new Date();
    await admin.save();

    // إنشاء JWT token
    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        admin: admin.toJSON(),
        token,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
