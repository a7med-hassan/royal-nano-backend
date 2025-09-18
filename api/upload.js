import { createUploadthing, createUploadthingExpressHandler } from "uploadthing/express";

const f = createUploadthing();

// Define your file router
const fileRouter = {
  cvUploader: f({
    fileTypes: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    maxFileSize: "4MB",
  }),
};

// Create the Express handler
export const uploadRouter = createUploadthingExpressHandler({
  router: fileRouter,
});
