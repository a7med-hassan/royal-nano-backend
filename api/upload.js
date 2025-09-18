import { createUploadthing } from "uploadthing/server";
import { createVercelHandler } from "uploadthing/vercel";

// 1. أنشئ object من uploadthing
const f = createUploadthing();

// 2. عرف الرواتر اللي يسمح برفع الملفات
const fileRouter = {
  cvUploader: f({ 
    pdf: { maxFileSize: "4MB" },
    "application/msword": { maxFileSize: "4MB" },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { maxFileSize: "4MB" }
  })
    .onUploadComplete(({ file }) => {
      console.log("✅ File uploaded:", file.url);
      return { fileUrl: file.url };
    }),
};

// 3. صدّر الـ GET و POST عشان Vercel يتعامل
export const { GET, POST } = createVercelHandler({
  router: fileRouter,
});
