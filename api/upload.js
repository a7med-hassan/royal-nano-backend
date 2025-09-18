const { createUploadthingExpressHandler } = require("uploadthing/express");

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ALLOWED_TYPES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]; // pdf + docx

const handler = createUploadthingExpressHandler({
  router: {
    cvUploader: {
      pdf: { maxFileSize: "4MB" },
      docx: { maxFileSize: "4MB" },
    },
  },
  config: {
    uploadthingSecret: process.env.UPLOADTHING_SECRET,
    uploadthingAppId: process.env.UPLOADTHING_APP_ID,
  },
  onUploadComplete: ({ file }) => {
    console.log("✅ CV uploaded:", file.url);
  },
  errorFormatter: (err) => {
    return { message: err?.message || "Unknown upload error" };
  },
});

// Export مباشرة لـ Vercel
module.exports = async function uploadHandler(req, res) {
  try {
    const file = req.files?.file?.[0];
    if (!file) {
      return res.status(400).json({ success: false, message: "No file provided" });
    }

    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return res.status(400).json({ success: false, message: "Invalid file type" });
    }

    if (file.size > MAX_FILE_SIZE) {
      return res.status(400).json({ success: false, message: "File exceeds 4MB limit" });
    }

    return handler(req, res); // uploadthing middleware
  } catch (err) {
    console.error("💥 Upload error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
