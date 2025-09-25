const express = require("express");
const router = express.Router();

const serviceTypes = [
  "حماية أساسية",
  "حماية شاملة", 
  "حماية متقدمة",
  "حماية VIP",
  "تأمين شامل",
  "تأمين ضد الحوادث",
  "تأمين ضد السرقة",
  "صيانة دورية",
  "خدمة الطوارئ",
  "خدمة الاستبدال"
];

router.get("/service-types", (req, res) => {
  // إعدادات CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    const search = req.query.q?.toLowerCase() || "";
    const results = serviceTypes.filter(type =>
      type.toLowerCase().includes(search)
    );

    res.status(200).json({
      success: true,
      message: "Service types retrieved successfully",
      data: results,
      count: results.length,
      total: serviceTypes.length
    });
  } catch (error) {
    console.error("Service types error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
});

module.exports = router;
