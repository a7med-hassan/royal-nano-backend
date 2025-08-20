const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// In-memory storage for local testing
let contacts = [];
let joins = [];

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running (Local Mode)" });
});

// Contact form - POST endpoint
app.post("/api/contact", async (req, res) => {
  try {
    const { fullName, email, message } = req.body;

    if (!fullName || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const contact = {
      id: Date.now(),
      fullName,
      email,
      message,
      createdAt: new Date(),
    };

    contacts.push(contact);

    res.status(201).json({
      success: true,
      message: "Contact form submitted successfully!",
      data: contact,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Contact form - GET endpoint (to retrieve contacts)
app.get("/api/contact", async (req, res) => {
  try {
    res.json({
      success: true,
      data: contacts.sort((a, b) => b.createdAt - a.createdAt),
    });
  } catch (error) {
    console.error("Get contacts error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Join form - POST endpoint
app.post("/api/join", async (req, res) => {
  try {
    const { fullName, phoneNumber, carType } = req.body;

    if (!fullName || !phoneNumber || !carType) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const join = {
      id: Date.now(),
      fullName,
      phoneNumber,
      carType,
      createdAt: new Date(),
    };

    joins.push(join);

    res.status(201).json({
      success: true,
      message: "Join request submitted successfully!",
      data: join,
    });
  } catch (error) {
    console.error("Join form error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Join form - GET endpoint (to retrieve join requests)
app.get("/api/join", async (req, res) => {
  try {
    res.json({
      success: true,
      data: joins.sort((a, b) => b.createdAt - a.createdAt),
    });
  } catch (error) {
    console.error("Get joins error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Local Server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 Contact form: http://localhost:${PORT}/api/contact`);
  console.log(`🤝 Join form: http://localhost:${PORT}/api/join`);
  console.log(`💾 Using in-memory storage (no MongoDB required)`);
});

module.exports = app;
