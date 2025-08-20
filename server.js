require('dotenv').config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

// -------------------
// MongoDB Connection
// -------------------
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error("❌ MONGO_URI not defined!");
  process.exit(1);
}

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// -------------------
// Middleware
// -------------------
app.use(cors());
app.use(express.json());

// -------------------
// Multer setup for file uploads (CVs)
// -------------------
const storage = multer.memoryStorage(); // Production: memory storage
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only PDF, DOC, and DOCX files are allowed!"));
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// -------------------
// Endpoints
// -------------------

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// Root
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Royal Nano Backend API",
    version: "1.0.0",
    endpoints: {
      contact: "POST /api/contact",
      join: "POST /api/join",
      health: "GET /api/health"
    },
  });
});

// Contact form
app.post("/api/contact", (req, res) => {
  const { fullName, phoneNumber, carType, carModel, notes } = req.body;
  if (!fullName || !phoneNumber) {
    return res.status(400).json({
      success: false,
      message: "Full name and phone number are required"
    });
  }
  console.log("📩 Contact form:", req.body);
  res.json({ success: true, message: "Contact form received" });
});

// Join form with CV upload
app.post("/api/join", upload.single("cv"), (req, res) => {
  const { fullName, phoneNumber, email, position, experience, message } = req.body;
  const cvFile = req.file;

  if (!fullName || !phoneNumber || !email || !position) {
    return res.status(400).json({ success: false, message: "Full name, phone number, email, and position are required" });
  }
  if (!cvFile) {
    return res.status(400).json({ success: false, message: "CV file is required" });
  }

  console.log("📄 Join form:", req.body);
  console.log("CV File:", cvFile.originalname, "Size:", (cvFile.size/1024).toFixed(2) + " KB");

  res.json({ success: true, message: "Join form received", cv: "Memory storage (production)" });
});

// -------------------
// Error handling
// -------------------
app.use((err, req, res, next) => {
  console.error("Error middleware:", err);
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ success: false, message: "File size too large. Maximum 5MB" });
  }
  if (err.message === "Only PDF, DOC, and DOCX files are allowed!") {
    return res.status(400).json({ success: false, message: err.message });
  }
  res.status(500).json({ success: false, message: "Internal server error", error: err.message });
});

// -------------------
// Start server
// -------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
