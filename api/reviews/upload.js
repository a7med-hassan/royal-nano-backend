const multer = require("multer");

// In serverless, memory storage only; real deployment should upload to cloud storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    cb(new Error("Invalid file type"));
  },
});

const single = upload.single("file");

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGINS || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  // Note: This endpoint returns a temporary URL (data URL) as a placeholder.
  // For production, use the presign route and upload to cloud storage.
  single(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    // Return a data URL as a simple placeholder
    const base64 = req.file.buffer.toString("base64");
    const photo_url = `data:${req.file.mimetype};base64,${base64}`;
    return res.status(200).json({ success: true, photo_url, filename: req.file.originalname });
  });
};


