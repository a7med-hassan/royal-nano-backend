const express = require("express");
const { createUploadthing, createExpressMiddleware } = require("uploadthing/express");

const app = express();

const f = createUploadthing();

// 📂 عرف الروتر بتاع الرفع
const uploadRouter = {
  cvUploader: f({ pdf: { maxFileSize: "4MB" } })
    .onUploadComplete(({ file }) => {
      console.log("✅ Uploaded CV:", file.url);
    }),
};

// 📌 Middleware الأساسي
app.use(
  "/api/upload",
  createExpressMiddleware({
    router: uploadRouter,
    config: {
      token: process.env.UPLOADTHING_SECRET,
    },
    errorFormatter: (err) => {
      return { message: err?.message || "Upload error" };
    },
  })
);

// للتأكد إن السيرفر شغال
app.get("/", (req, res) => {
  res.send("🚀 Server is running with Uploadthing!");
});

module.exports = app;
