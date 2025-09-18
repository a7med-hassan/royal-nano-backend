const express = require("express");
const { createUploadthing, createUploadthingExpressHandler } = require("uploadthing/express");

const app = express();

// ✅ أنشئ uploader
const f = createUploadthing();

// ✅ عرف routes الرفع
const uploadRouter = createUploadthingExpressHandler({
  router: {
    cvUploader: f({
      pdf: { maxFileSize: "4MB" },
      "application/msword": { maxFileSize: "4MB" },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { maxFileSize: "4MB" }
    }),
  },
  config: {
    token: process.env.UPLOADTHING_SECRET, // 👈 مهم جدًا
  },
  errorFormatter: (err) => {
    console.error("❌ Upload error:", err);
    return { message: err.message };
  },
  onUploadComplete: ({ file }) => {
    console.log("✅ CV uploaded:", file.url);
    return { fileUrl: file.url };
  },
});

// ✅ اربط المسار
app.use("/api/upload", uploadRouter);

module.exports = app;
