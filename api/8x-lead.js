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
      console.log("📥 Received request body:", JSON.stringify(req.body));

      const { full_name, mobile, notes } = req.body;

      // تحقق أساسي
      if (!full_name || !mobile) {
        console.error("❌ Missing required fields:", { full_name: !!full_name, mobile: !!mobile });
        return res.status(400).json({
          success: false,
          message: "الاسم ورقم الهاتف مطلوبان لإرسال الطلب إلى 8xCRM.",
        });
      }

      console.log("🚀 Sending lead to 8xCRM...");

      // 1️⃣ الحصول على Access Token من 8xCRM
      // ⚠️ مهم: تأكد من أن client_id و client_secret مرتبطين بالحساب (username/password)
      // احصل على البيانات الصحيحة من لوحة تحكم 8xCRM → API / OAuth Clients
      // ✅ تنظيف البيانات من المسافات الزائدة
      const EIGHTX_CLIENT_ID = (process.env.EIGHTX_CLIENT_ID || "2").trim();
      const EIGHTX_CLIENT_SECRET = (process.env.EIGHTX_CLIENT_SECRET || "mbRrnLa1LzYZTfHtqeUsE2ZJUC53exFl8HBAMYDg").trim();
      const EIGHTX_USERNAME = (process.env.EIGHTX_USERNAME || "royalnanoceramic@gmail.com").trim();
      const EIGHTX_PASSWORD = (process.env.EIGHTX_PASSWORD || "123456").trim();

      // ✅ Body بالضبط كما هو مطلوب من 8xCRM (Password Grant)
      const tokenRequestBody = {
        grant_type: "password",
        client_id: EIGHTX_CLIENT_ID,
        client_secret: EIGHTX_CLIENT_SECRET,
        username: EIGHTX_USERNAME,
        password: EIGHTX_PASSWORD,
      };

      console.log("🔑 Requesting 8xCRM Token with credentials:", {
        grant_type: tokenRequestBody.grant_type,
        client_id: tokenRequestBody.client_id,
        username: tokenRequestBody.username,
        // لا نطبع password/client_secret للأمان
      });

      let tokenResponse;
      try {
        tokenResponse = await axios.post(
          "https://royalnano.8xcrm.com/oauth/token",
          tokenRequestBody,
          {
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "User-Agent": "RoyalNano/Web",
            },
            timeout: 10000,
          }
        );

        if (!tokenResponse.data || !tokenResponse.data.access_token) {
          console.error("❌ Invalid token response:", tokenResponse.data);
          return res.status(500).json({
            success: false,
            message: "فشل الحصول على Access Token من 8xCRM.",
            error: "Invalid token response",
          });
        }
      } catch (tokenError) {
        const errorData = tokenError.response?.data || {};
        const errorMessage = errorData.error_description || errorData.error || tokenError.message;
        
        console.error("❌ Token error:", {
          error: errorData.error,
          description: errorData.error_description,
          message: errorMessage,
          status: tokenError.response?.status,
        });

        // معالجة خاصة لخطأ invalid_client
        if (errorData.error === "invalid_client") {
          return res.status(401).json({
            success: false,
            message: "❌ بيانات الاعتماد غير صحيحة. تأكد من client_id و client_secret في لوحة تحكم 8xCRM.",
            error: {
              code: "invalid_client",
              description: "Client authentication failed. تأكد من أن client_id و client_secret مرتبطين بالحساب (username/password).",
              details: "احصل على البيانات الصحيحة من: 8xCRM Dashboard → API / OAuth Clients",
            },
          });
        }

        return res.status(500).json({
          success: false,
          message: "فشل الحصول على Access Token من 8xCRM.",
          error: errorData,
        });
      }

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

      console.log("📦 8xCRM Payload:", JSON.stringify(leadPayload));

      // 3️⃣ إرسال البيانات لـ 8xCRM
      try {
        const eightxResponse = await axios.post(
          "https://royalnano.8xcrm.com/api/v1/lead_generation/web_form_routings/storeLead",
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

        console.log("✅ 8xCRM Response:", JSON.stringify(eightxResponse.data));

        return res.status(200).json({
          success: true,
          message: "✅ تم إرسال البيانات إلى 8xCRM بنجاح.",
          eightxResponse: eightxResponse.data,
        });
      } catch (leadError) {
        console.error("❌ Lead submission error:", {
          status: leadError.response?.status,
          data: leadError.response?.data,
          message: leadError.message,
        });
        return res.status(500).json({
          success: false,
          message: "فشل إرسال البيانات إلى 8xCRM.",
          error: leadError.response?.data || leadError.message,
        });
      }
    } catch (error) {
      console.error("❌ General error:", {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
      });
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

