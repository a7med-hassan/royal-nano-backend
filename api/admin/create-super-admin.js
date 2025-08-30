const dbConnect = require("../../lib/dbConnect");
const Admin = require("../../models/Admin");

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

    // التحقق من وجود Super Admin
    const existingSuperAdmin = await Admin.findOne({ role: "super_admin" });

    if (existingSuperAdmin) {
      return res.status(400).json({
        success: false,
        message: "Super admin already exists.",
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

    // إنشاء Super Admin
    const superAdmin = new Admin({
      username,
      password,
      role: "super_admin",
    });

    await superAdmin.save();

    res.status(201).json({
      success: true,
      message: "Super admin created successfully",
      data: {
        admin: superAdmin.toJSON(),
      },
    });
  } catch (error) {
    console.error("Super admin creation error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
