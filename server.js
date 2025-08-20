const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

// Contact form
app.post("/api/contact", (req, res) => {
  const { fullName, email, message } = req.body;
  if (!fullName || !email || !message) {
    return res.status(400).json({ success: false, message: "All fields required" });
  }
  res.json({ success: true, message: "Contact saved!" });
});

// Join form
app.post("/api/join", (req, res) => {
  const { fullName, phoneNumber, carType } = req.body;
  if (!fullName || !phoneNumber || !carType) {
    return res.status(400).json({ success: false, message: "All fields required" });
  }
  res.json({ success: true, message: "Join request saved!" });
});

// Export for Vercel
module.exports = app;
