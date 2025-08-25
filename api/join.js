const dbConnect = require("../lib/dbConnect");
const Join = require("../models/Join");
const multer = require("multer");

// إعداد multer لمعالجة الملفات
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // السماح بملفات PDF و Word فقط
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/msword" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and Word files are allowed"), false);
    }
  },
});

// معالجة رفع ملف واحد (CV)
const uploadSingle = upload.single("cv");

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
    // معالجة رفع الملف
    uploadSingle(req, res, async (err) => {
      if (err) {
        console.error("File upload error:", err);
        return res.status(400).json({
          success: false,
          message: "File upload failed",
          error: err.message,
        });
      }

      try {
        console.log("📨 Received join form data:", req.body);
        console.log(
          "📁 File info:",
          req.file
            ? {
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
              }
            : "No file uploaded"
        );

        const {
          fullName,
          phoneNumber,
          email,
          jobPosition,
          experience,
          additionalMessage,
        } = req.body;

        console.log("🔍 Extracted fields:", {
          fullName,
          phoneNumber,
          email,
          jobPosition,
          experience,
          additionalMessage,
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
          cvFileName: req.file ? req.file.originalname : null,
          cvPath: req.file ? `/uploads/cv/${req.file.originalname}` : null,
          status: "pending", // Default status
        });

        await join.save();

        res.status(200).json({
          success: true,
          message: "Job application submitted successfully",
          data: join,
          fileUploaded: !!req.file,
          fileName: req.file ? req.file.originalname : null,
        });
      } catch (error) {
        console.error("Join save error:", error);
        res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error.message,
        });
      }
    });
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
