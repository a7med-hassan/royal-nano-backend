const dbConnect = require("../lib/dbConnect");
const Join = require("../models/Join");

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
      console.log("📨 Received join form data:", req.body);

      const {
        fullName,
        phoneNumber,
        email,
        jobPosition,
        experience,
        additionalMessage,
        // cvFileUrl, // رابط الملف من Uploadthing - مؤقتاً مخفي
        // cvFileName, // اسم الملف - مؤقتاً مخفي
      } = req.body;

      console.log("🔍 Extracted fields:", {
        fullName,
        phoneNumber,
        email,
        jobPosition,
        experience,
        additionalMessage,
        // cvFileUrl, // مؤقتاً مخفي
        // cvFileName, // مؤقتاً مخفي
      });

      // Validate required fields
      if (!fullName || !phoneNumber || !jobPosition) {
        console.log("❌ Validation failed:", {
          hasFullName: !!fullName,
          hasPhoneNumber: !!phoneNumber,
          hasJobPosition: !!jobPosition,
        });

        return res.status(400).json({
          success: false,
          message:
            "Required fields are missing: fullName, phoneNumber, jobPosition",
          receivedData: req.body,
          missingFields: {
            fullName: !fullName,
            phoneNumber: !phoneNumber,
            jobPosition: !jobPosition,
          },
        });
      }

      const join = new Join({
        fullName,
        phoneNumber,
        email,
        jobPosition,
        experience,
        additionalMessage,
        cvFileName: null, // مؤقتاً مخفي
        cvPath: null, // مؤقتاً مخفي
        status: "pending", // Default status
      });

      await join.save();

      console.log("✅ Job application saved successfully:", join._id);

      // إرسال البيانات إلى EngazCRM عبر Proxy
      try {
        // إرسال البيانات الأصلية للـ Proxy (سيتولى الـ mapping)
        const proxyPayload = {
          fullName,
          phoneNumber,
          email,
          jobPosition,
          experience,
          additionalMessage,
        };

        console.log("📤 Sending job application to EngazCRM via proxy:", proxyPayload);
        
        const engazRes = await axios.post(`${req.protocol}://${req.get('host')}/api/engazcrm-join`, proxyPayload, {
          timeout: 10000, // 10 seconds timeout
          headers: {
            'Content-Type': 'application/json',
          }
        });

        console.log("✅ EngazCRM join proxy response:", engazRes.data);

        res.status(200).json({
          success: true,
          message: "Job application submitted successfully and sent to EngazCRM (CV upload temporarily disabled)",
          data: join,
          engazResponse: engazRes.data,
          fileUploaded: false, // مؤقتاً مخفي
          fileName: null, // مؤقتاً مخفي
          fileUrl: null, // مؤقتاً مخفي
          note: "CV upload feature is temporarily disabled while fixing upload issues",
        });
      } catch (engazError) {
        console.error("❌ EngazCRM join proxy error:", engazError.response?.data || engazError.message);
        
        // إرجاع نجاح مع تحذير من فشل EngazCRM
        res.status(200).json({
          success: true,
          message: "Job application submitted successfully, but failed to send to EngazCRM (CV upload temporarily disabled)",
          data: join,
          engazError: engazError.response?.data || engazError.message,
          warning: "Data saved locally but not synced to CRM",
          fileUploaded: false, // مؤقتاً مخفي
          fileName: null, // مؤقتاً مخفي
          fileUrl: null, // مؤقتاً مخفي
          note: "CV upload feature is temporarily disabled while fixing upload issues",
        });
      }
    } catch (error) {
      console.error("💥 Join save error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  } else if (req.method === "GET") {
    try {
      const joins = await Join.find({}).sort({ createdAt: -1 }).select("-__v");

      res.status(200).json({
        success: true,
        message: "Job applications retrieved successfully",
        data: joins,
        count: joins.length,
      });
    } catch (error) {
      console.error("Join retrieval error:", error);
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
