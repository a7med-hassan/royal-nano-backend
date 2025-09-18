const express = require("express");
const { createUploadthing, createUploadthingExpressHandler } = require("uploadthing/express");

const app = express();

// ✅ تعريف الـ uploader
const f = createUploadthing();

const uploadRouter = createUploadthingExpressHandler({
  router: {
    cvUploader: f({ 
      pdf: { maxFileSize: "4MB" },
      "application/msword": { maxFileSize: "4MB" },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { maxFileSize: "4MB" }
    })
  },
  onUploadComplete: ({ file }) => {
    console.log("✅ File uploaded:", file.url);
    return { fileUrl: file.url };
  },
});

// ✅ لازم Vercel يشوفه
app.use("/api/upload", uploadRouter);

module.exports = app;
