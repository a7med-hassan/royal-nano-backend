const dbConnect = require("../lib/dbConnect");
const { setupCors } = require("../lib/cors");

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
    res.json({
      success: true,
      message: "Server is running",
      mongodb: "connected",
      timestamp: new Date().toISOString(),
      connection: "cached",
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
    res.json({
      success: true,
      message: "Server is running",
      mongodb: "disconnected",
      timestamp: new Date().toISOString(),
      error: err.message,
      connection: "failed",
    });
  }
};
