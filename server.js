const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// ========================
// Middlewares
// ========================
app.use(cors());
app.use(bodyParser.json());

// ========================
// Connect to MongoDB
// ========================
const MONGO_URI = process.env.MONGO_URI || "your-mongodb-connection-string";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ========================
// Schemas & Models
// ========================
const ContactSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const JoinSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    carType: { type: String, required: true },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", ContactSchema);
const Join = mongoose.model("Join", JoinSchema);

// ========================
// Routes
// ========================

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Contact form endpoint
app.post("/api/contact", async (req, res) => {
  try {
    const { fullName, phoneNumber, message } = req.body;

    if (!fullName || !phoneNumber || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newMessage = new Contact({ fullName, phoneNumber, message });
    await newMessage.save();

    res.json({
      success: true,
      message: "Contact form received and saved",
      data: newMessage,
    });
  } catch (err) {
    console.error("❌ Error in /api/contact:", err.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
});

// Join us form endpoint
app.post("/api/join", async (req, res) => {
  try {
    const { fullName, phoneNumber, carType } = req.body;

    if (!fullName || !phoneNumber || !carType) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newJoin = new Join({ fullName, phoneNumber, carType });
    await newJoin.save();

    res.json({
      success: true,
      message: "Join form received and saved",
      data: newJoin,
    });
  } catch (err) {
    console.error("❌ Error in /api/join:", err.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
});

// ========================
// Export for Vercel
// ========================
module.exports = app;
