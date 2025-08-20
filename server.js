const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Simple Mongoose schemas (example)
const contactSchema = new mongoose.Schema({
  fullName: String,
  phoneNumber: String,
  carType: String,
  carModel: String,
  notes: String,
  createdAt: { type: Date, default: Date.now },
});
const joinSchema = new mongoose.Schema({
  fullName: String,
  phoneNumber: String,
  email: String,
  position: String,
  experience: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});
const Contact = mongoose.model("Contact", contactSchema);
const Join = mongoose.model("Join", joinSchema);

// Configure multer for CV uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    cb(null, allowed.includes(file.mimetype));
  },
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// Contact form endpoint
app.post("/api/contact", async (req, res) => {
  try {
    const { fullName, phoneNumber, carType, carModel, notes } = req.body;
    if (!fullName || !phoneNumber) {
      return res.status(400).json({ success: false, message: "Full name and phone number required" });
    }
    const contact = new Contact({ fullName, phoneNumber, carType, carModel, notes });
    await contact.save();
    res.json({ success: true, message: "Contact form received" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
});

// Join form endpoint
app.post("/api/join", upload.single("cv"), async (req, res) => {
  try {
    const { fullName, phoneNumber, email, position, experience, message } = req.body;
    if (!fullName || !phoneNumber || !email || !position || !req.file) {
      return res.status(400).json({ success: false, message: "All fields and CV are required" });
    }
    const join = new Join({ fullName, phoneNumber, email, position, experience, message });
    await join.save();
    res.json({ success: true, message: "Join form received" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Royal Nano Backend API",
    version: "1.0.0",
    endpoints: {
      contact: "POST /api/contact",
      join: "POST /api/join",
      health: "GET /api/health",
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
