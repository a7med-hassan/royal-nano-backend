const axios = require("axios");

const ENGAZ_WEBHOOK = "https://api.engazcrm.net/webhook/integration/royalnanoceramic/11/8/1";

module.exports = async function handler(req, res) {
  // إعدادات CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, OPTIONS"
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

  // السماح بـ POST فقط
  if (req.method !== "POST") {
    return res.status(405).json({ 
      error: "Method Not Allowed",
      message: "Only POST method is allowed for EngazCRM proxy"
    });
  }

  try {
    console.log("🔄 Proxy request to EngazCRM:", {
      body: req.body,
      webhook: ENGAZ_WEBHOOK
    });

    // الفورم يبعت البيانات مباشرة بنفس أسماء EngazCRM
    const response = await axios.post(ENGAZ_WEBHOOK, req.body, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });

    console.log("✅ EngazCRM proxy response:", response.data);

    res.status(200).json(response.data);
  } catch (error) {
    console.error("❌ EngazCRM error:", error.response?.data || error.message);
    
    res.status(500).json({
      error: "Failed to send to EngazCRM",
      details: error.response?.data || error.message,
    });
  }
};
