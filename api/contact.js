const dbConnect = require("../lib/dbConnect");
const Contact = require("../models/Contact");
const axios = require("axios");

// EngazCRM Webhook URL
const ENGAZ_WEBHOOK = "https://api.engazcrm.net/webhook/integration/royalnanoceramic/11/8/1";

module.exports = async function handler(req, res) {
  // ✅ السماح بأكثر من مصدر (للتطوير والإنتاج)
  const allowedOrigins = [
    "https://www.royalnanoceramic.com",  // الموقع الحقيقي
    "http://localhost:4200"              // وقت التطوير
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept");
  res.setHeader("Access-Control-Max-Age", "86400");

  // ✅ معالجة preflight requests - يجب أن تكون قبل أي منطق آخر
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  await dbConnect();

  if (req.method === "POST") {
    try {
      const {
        full_name, // الاسم
        mobile,    // الهاتف
        client_16492512972331, // ماركة العربية (اختياري)
        client_16849336084508, // الموديل (اختياري)
        client_16492513797105, // الملاحظات (اختياري)
        client_17293620987926, // نوع الخدمة (اختياري)
        utm_source,
        utm_medium,
        utm_campaign,
        form_source // نوع الفورم (اختياري - landing, contact, mini)
      } = req.body;

      // ✅ تحقق أساسي: لازم يكون فيه على الأقل اسم وموبايل
      if (!full_name || !mobile) {
        return res.status(400).json({
          success: false,
          message: "الاسم ورقم الهاتف مطلوبان.",
        });
      }

      // 🧠 إعداد بيانات الحفظ الديناميكية
      const contactData = {
        fullName: full_name,
        phoneNumber: mobile,
        carType: client_16492512972331 || "",
        carModel: client_16849336084508 || "",
        additionalNotes: client_16492513797105 || "",
        serviceType: client_17293620987926 || "",
        utm_source,
        utm_medium,
        utm_campaign,
        formSource: form_source || "unspecified",
      };

      // ✅ حفظ البيانات في قاعدة البيانات
      const contact = new Contact(contactData);
      await contact.save();

      // ✅ إرسال فقط الحقول اللي العميل فعلاً دخلها إلى EngazCRM
      const engazPayload = {};
      for (const [key, value] of Object.entries(req.body)) {
        if (value !== "" && value !== null && value !== undefined) {
          engazPayload[key] = value;
        }
      }

      // إرسال البيانات لـ EngazCRM
      try {
        const engazRes = await axios.post(ENGAZ_WEBHOOK, engazPayload, {
          timeout: 10000,
          headers: { "Content-Type": "application/json" },
        });

        // ✅ إرسال البيانات إلى 8xCRM بعد EngazCRM
        try {
          // 1️⃣ أولاً نحصل على Access Token
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
            }
          );

          const accessToken = tokenResponse.data.access_token;

          // 2️⃣ تجهيز البيانات نفسها اللي جت من الفورم
          const leadPayload = {
            full_name: full_name,
            mobile: mobile,
            client_16492512972331: client_16492512972331, // ماركة العربية
            client_16849336084508: client_16849336084508, // الموديل
            client_16492513797105: client_16492513797105, // الملاحظات
            client_17293620987926: client_17293620987926, // نوع الخدمة
            utm_source,
            utm_medium,
            utm_campaign,
          };

          // 3️⃣ إرسالها إلى 8xCRM
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
            }
          );

          console.log("✅ Lead sent to 8xCRM:", eightxResponse.data);
        } catch (eightxError) {
          console.error("❌ Error sending lead to 8xCRM:", eightxError.response?.data || eightxError.message);
        }

        res.status(200).json({
          success: true,
          message: "✅ تم حفظ الطلب وإرساله إلى EngazCRM بنجاح.",
          data: contact,
          engazResponse: engazRes.data,
        });
      } catch (engazError) {
        console.error("❌ EngazCRM error:", engazError.response?.data || engazError.message);

        res.status(200).json({
          success: true,
          message: "✅ تم حفظ الطلب، ولكن فشل الإرسال إلى EngazCRM.",
          data: contact,
          engazError: engazError.response?.data || engazError.message,
        });
      }
    } catch (error) {
      console.error("Contact save error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  } else if (req.method === "GET") {
    try {
      const contacts = await Contact.find({})
        .sort({ createdAt: -1 })
        .select("-__v");

      res.status(200).json({
        success: true,
        message: "Contacts retrieved successfully",
        data: contacts,
        count: contacts.length,
      });
    } catch (error) {
      console.error("Contact retrieval error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  } else {
    res.status(405).json({
      success: false,
      message: "Method not allowed. Use POST to submit or GET to retrieve.",
    });
  }
};