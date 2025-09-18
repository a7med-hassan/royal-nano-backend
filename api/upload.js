import { createUploadthing, createRouteHandler } from "uploadthing/server";

const f = createUploadthing();

export const { POST } = createRouteHandler({
  router: f({
    cvUploader: {
      fileTypes: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      maxFileSize: "4MB",
    },
  }),
  onUploadComplete: ({ file }) => {
    console.log("✅ File uploaded:", file.url);
    return { fileUrl: file.url };
  },
});
