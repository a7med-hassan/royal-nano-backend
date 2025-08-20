const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.MONGO_URI;

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// Mongoose connection state helper
function getMongoStatus() {
  switch (mongoose.connection.readyState) {
    case 0: return "disconnected";
    case 1: return "connected";
    case 2: return "connecting";
    case 3: return "disconnecting";
    default: return "unknown";
  }
}

// Multer setup for file uploads (join form)
const upload = multer({ storage: multer.memoryStorage() });

// Routes
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    mongodb: getMongoStatus(),
    timestamp: new Date().toISOString(),
  });
});

app.post("/api/contact", async (req, res) => {
  const { fullName, phoneNumber, carType, carModel, notes } = req.body;
  if (!fullName || !phoneNumber) {
    return res.status(400).json({
      success: false,
      message: "Full name and phone number are required",
    });
  }

  console.log("📩 Contact form:", req.body);
  res.json({ success: true, message: "Contact form received" });
});

app.post("/api/join", upload.single("cv"), async (req, res) => {
  const { fullName, phoneNumber, email, position, experience, message } = req.body;
  if (!fullName || !phoneNumber || !email || !position) {
    return res.status(400).json({
      success: false,
      message: "Full name, phone number, email, and position are required",
    });
  }

  if (!req.file) {
    return res.status(400).json({ success: false, message: "CV file is required" });
  }

  console.log("📩 Join form:", req.body);
  console.log("📄 CV file:", req.file.originalname, req.file.size, "bytes");

  res.json({ success: true, message: "Join form received" });
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
      health: "GET /api/health",
    },
  });
});

module.exports = app;
