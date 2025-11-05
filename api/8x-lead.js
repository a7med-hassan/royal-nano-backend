const axios = require("axios");

module.exports = async function handler(req, res) {
  // ✅ السماح بالوصول من موقعك ومن البيئة المحلية
  const allowedOrigins = [
    "https://www.royalnanoceramic.com",
    "http://localhost:4200"
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "https://www.royalnanoceramic.com");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept");
  res.setHeader("Access-Control-Max-Age", "86400");

  // ✅ لو الطلب من نوع OPTIONS (preflight)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    try {
      const { full_name, mobile, notes } = req.body;

      // تحقق أساسي
      if (!full_name || !mobile) {
        return res.status(400).json({
          success: false,
          message: "الاسم ورقم الهاتف مطلوبان لإرسال الطلب إلى 8xCRM.",
        });
      }

      console.log("🚀 Sending lead to 8xCRM...");

      // 1️⃣ الحصول على Access Token من 8xCRM
      const tokenResponse = await axios.post(
        "https://testing.8xcrm.com/oauth/token",
        {
          grant_type: "password",
          client_id: "2",
          client_secret: "mbRrnLa1LzYZTfHtqeUsE2ZJUC53exFl8HBAMYDg",
          username: "support@8worx.com",
          password: "123456",
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "RoyalNano/Web",
          },
          timeout: 10000,
        }
      );

      const accessToken = tokenResponse.data.access_token;
      console.log("✅ 8xCRM Token acquired successfully");

      // 2️⃣ تجهيز البيانات بصيغة 8xCRM
      const leadPayload = {
        title: "Mr",
        full_name: full_name,
        description: notes || "",
        phones: [
          {
            phone: mobile,
            country_code: "EG",
          },
        ],
        form_id: "000001",
      };

      console.log("📦 8xCRM Payload:", leadPayload);

      // 3️⃣ إرسال البيانات لـ 8xCRM
      const eightxResponse = await axios.post(
        "https://testing.8xcrm.com/api/v1/lead_generation/web_form_routings/storeLead",
        leadPayload,
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${accessToken}`,
            "User-Agent": "RoyalNano/Web",
          },
          timeout: 10000,
        }
      );

      console.log("✅ 8xCRM Response:", eightxResponse.data);

      return res.status(200).json({
        success: true,
        message: "✅ تم إرسال البيانات إلى 8xCRM بنجاح.",
        eightxResponse: eightxResponse.data,
      });
    } catch (error) {
      console.error("❌ Error sending to 8xCRM:", error.response?.data || error.message);
      return res.status(500).json({
        success: false,
        message: "حدث خطأ أثناء إرسال البيانات إلى 8xCRM.",
        error: error.response?.data || error.message,
      });
    }
  } else {
    res.status(405).json({
      success: false,
      message: "Method not allowed. Use POST.",
    });
  }
};

