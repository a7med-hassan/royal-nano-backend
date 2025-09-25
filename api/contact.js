const dbConnect = require("../lib/dbConnect");
const Contact = require("../models/Contact");
const axios = require("axios");

// EngazCRM Webhook URL
const ENGAZ_WEBHOOK = "https://api.engazcrm.net/webhook/integration/royalnanoceramic/11/8/1";

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

  await dbConnect();

  if (req.method === "POST") {
    try {
      const {
        full_name, // الاسم
        mobile,    // الهاتف
        client_16492512972331, // ماركة العربية
        client_16849336084508, // الموديل
        client_16492513797105, // الملاحظات
        client_17293620987926, // نوع الخدمة
        utm_source,
        utm_medium,
        utm_campaign,
      } = req.body;

      // التحقق من الحقول الأساسية
      if (!full_name || !mobile || !client_16492512972331 || !client_16849336084508) {
        return res.status(400).json({
          success: false,
          message: "All required fields are required: full_name, mobile, carBrand, carModel",
        });
      }

      // حفظ البيانات محليًا في MongoDB
      const contact = new Contact({
        fullName: full_name,
        phoneNumber: mobile,
        carType: client_16492512972331,
        carModel: client_16849336084508,
        additionalNotes: client_16492513797105,
        serviceType: client_17293620987926,
        utm_source,
        utm_medium,
        utm_campaign,
      });

      await contact.save();

      // إرسال البيانات إلى EngazCRM مباشرة
      try {
        const engazPayload = {
          full_name,
          mobile,
          client_16492512972331,
          client_16849336084508,
          client_16492513797105,
          client_17293620987926,
        };

        const engazRes = await axios.post(ENGAZ_WEBHOOK, engazPayload, {
          timeout: 10000,
          headers: { "Content-Type": "application/json" },
        });

        res.status(200).json({
          success: true,
          message:
            "Car protection service request saved successfully and sent to EngazCRM",
          data: contact,
          engazResponse: engazRes.data,
        });
      } catch (engazError) {
        console.error("❌ EngazCRM error:", engazError.response?.data || engazError.message);

        res.status(200).json({
          success: true,
          message:
            "Car protection service request saved successfully, but failed to send to EngazCRM",
          data: contact,
          engazError: engazError.response?.data || engazError.message,
          warning: "Data saved locally but not synced to CRM",
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