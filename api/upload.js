const { createUploadthingExpressHandler } = require("uploadthing/express");

// config الأساسي
const handler = createUploadthingExpressHandler({
  router: {
    cvUploader: {
      // هنا تقدر تحدد أنواع الملفات والحجم
      pdf: { maxFileSize: "4MB" },
      docx: { maxFileSize: "4MB" },
    },
  },
  config: {
    uploadthingSecret: process.env.UPLOADTHING_SECRET,
    uploadthingAppId: process.env.UPLOADTHING_APP_ID,
  },
  onUploadComplete: async ({ file }) => {
    console.log("✅ File uploaded:", file.url);
    return { fileUrl: file.url };
  },
});

// 👇 لازم export default عشان Vercel يعرف يتعامل معاه
module.exports = async function uploadthingHandler(req, res) {
  return handler(req, res);
};
