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

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const token = process.env.UPLOADTHING_TOKEN;
    if (!token) {
      console.error("❌ UPLOADTHING_TOKEN is missing");
      return res.status(500).json({
        success: false,
        error: "UPLOADTHING_TOKEN is missing",
      });
    }

    console.log("📤 Starting file upload to Uploadthing...");
    console.log("📋 Request headers:", req.headers);
    console.log("📋 Content-Type:", req.headers["content-type"]);

    // إرسال الملف مباشرة إلى Uploadthing API
    const response = await fetch("https://api.uploadthing.com/v1/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // لا نضيف Content-Type هنا، نترك fetch يحدده تلقائياً
      },
      body: req, // الملف من Angular FormData
    });

    console.log("📤 Upload response status:", response.status);
    console.log("📤 Upload response headers:", response.headers);

    const data = await response.json();
    console.log("📤 Upload response data:", data);

    if (!response.ok) {
      console.error("❌ Uploadthing API error:", data);
      return res.status(response.status).json({
        success: false,
        error: data,
      });
    }

    console.log("✅ File uploaded successfully:", data);

    return res.status(200).json({
      success: true,
      fileUrl: data.fileUrl ?? data.url,
    });

  } catch (err) {
    console.error("💥 Upload error:", err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
