const dbConnect = require("../lib/dbConnect");

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
