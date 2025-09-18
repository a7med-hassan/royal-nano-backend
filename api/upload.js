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

  if (req.method !== "POST") {
    return res.status(405).json({ 
      success: false,
      error: "Method not allowed. Use POST only." 
    });
  }

  try {
    const token = process.env.UPLOADTHING_TOKEN;
    if (!token) {
      return res.status(500).json({ 
        success: false,
        error: "UPLOADTHING_TOKEN is missing from environment variables" 
      });
    }

    console.log("📤 Starting file upload to Uploadthing...");

    // إرسال الملف مباشرة إلى Uploadthing API
    const response = await fetch("https://api.uploadthing.com/v1/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": req.headers["content-type"] || "multipart/form-data",
      },
      body: req.body, // الملف من Angular FormData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Uploadthing API error:", errorText);
      return res.status(response.status).json({ 
        success: false,
        error: `Upload failed: ${errorText}` 
      });
    }

    const data = await response.json();
    console.log("✅ File uploaded successfully:", data);

    // إرجاع رابط الملف
    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: {
        fileUrl: data.fileUrl || data.url, // حسب رد Uploadthing
        fileName: data.fileName || data.name,
        fileSize: data.fileSize || data.size,
        fileType: data.fileType || data.type,
      }
    });

  } catch (error) {
    console.error("💥 Upload error:", error);
    return res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};
