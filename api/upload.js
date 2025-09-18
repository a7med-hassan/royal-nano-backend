const express = require("express");
const { createUploadthing, createUploadthingExpressHandler } = require("uploadthing/express");

const app = express();

// ✅ أنشئ uploader
const f = createUploadthing();

// ✅ هاندلر للرفع
const uploadRouter = createUploadthingExpressHandler({
  router: {
    cvUploader: f({
      pdf: { maxFileSize: "4MB" },
    }),
  },
  config: {
    token: process.env.UPLOADTHING_SECRET, // لازم تحطه في Vercel Environment Variables
  },
  errorFormatter: (err) => {
    return { message: err?.message || "Unknown upload error" };
  },
  onUploadComplete: ({ file }) => {
    console.log("✅ CV uploaded:", file.url);
  },
});

// ✅ اربط المسار
app.use("/api/upload", uploadRouter);

module.exports = app;
