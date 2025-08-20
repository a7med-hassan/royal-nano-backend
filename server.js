const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

// MongoDB Connection
// Updated with new password: ahmed123 (no special characters)
const uri =
  process.env.MONGO_URI ||
  "mongodb+srv://admin:ahmed123@ryoalnan.ev2z8cp.mongodb.net/royalNano?retryWrites=true&w=majority&appName=ryoalnan";

// Connect to MongoDB with better error handling
mongoose
  .connect(uri, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  })
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
    console.log("📊 Database: royalNano");
    console.log("🌐 Cluster: ryoalnan");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    console.log(
      "💡 Make sure your MongoDB Atlas cluster is running and accessible"
    );
    console.log(
      "💡 Check if your IP is whitelisted in MongoDB Atlas Network Access"
    );
  });

// Contact Form Schema
const contactSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Join Form Schema
const joinSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  carType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Contact = mongoose.model("Contact", contactSchema);
const Join = mongoose.model("Join", joinSchema);

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  const mongoStatus =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({
    success: true,
    message: "Server is running",
    mongodb: mongoStatus,
    timestamp: new Date().toISOString(),
  });
});

// Contact form - POST endpoint
app.post("/api/contact", async (req, res) => {
  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database connection not available",
      });
    }

    const { fullName, email, message } = req.body;

    if (!fullName || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const contact = new Contact({ fullName, email, message });
    await contact.save();

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
      error: error.message,
    });
  }
});

// Contact form - GET endpoint (to retrieve contacts)
app.get("/api/contact", async (req, res) => {
  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database connection not available",
      });
    }

    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    console.error("Get contacts error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Join form - POST endpoint
app.post("/api/join", async (req, res) => {
  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database connection not available",
      });
    }

    const { fullName, phoneNumber, carType } = req.body;

    if (!fullName || !phoneNumber || !carType) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const join = new Join({ fullName, phoneNumber, carType });
    await join.save();

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
      error: error.message,
    });
  }
});

// Join form - GET endpoint (to retrieve join requests)
app.get("/api/join", async (req, res) => {
  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database connection not available",
      });
    }

    const joins = await Join.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: joins,
    });
  } catch (error) {
    console.error("Get joins error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 Contact form: http://localhost:${PORT}/api/contact`);
  console.log(`🤝 Join form: http://localhost:${PORT}/api/join`);
  console.log(
    `🗄️ MongoDB: ${
      mongoose.connection.readyState === 1 ? "✅ Connected" : "❌ Disconnected"
    }`
  );
});

// Export for Vercel
module.exports = app;
