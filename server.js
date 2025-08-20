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

// Contact Form Schema - للتواصل العام مع الشركة
const contactSchema = new mongoose.Schema({
  contactName: { type: String, required: true }, // اسم صاحب الاستفسار
  contactEmail: { type: String, required: true }, // البريد الإلكتروني
  contactPhone: { type: String, required: false }, // رقم الهاتف (اختياري)
  contactSubject: { type: String, required: true }, // موضوع الاستفسار
  contactMessage: { type: String, required: true }, // الرسالة
  contactType: {
    type: String,
    enum: ["general", "support", "partnership", "other"],
    default: "general",
  }, // نوع الاستفسار
  createdAt: { type: Date, default: Date.now },
});

// Join Form Schema - نموذج التقديم للوظائف
const joinSchema = new mongoose.Schema({
  fullName: { type: String, required: true }, // الاسم الكامل *
  phoneNumber: { type: String, required: true }, // رقم الهاتف *
  email: { type: String, required: false }, // البريد الإلكتروني
  jobPosition: { type: String, required: true }, // الوظيفة المطلوبة *
  experience: { type: String, required: false }, // الخبرة السابقة
  additionalMessage: { type: String, required: false }, // رسالة إضافية
  cvFileName: { type: String, required: false }, // اسم ملف السيرة الذاتية
  cvPath: { type: String, required: false }, // مسار ملف السيرة الذاتية
  status: {
    type: String,
    enum: ["pending", "reviewed", "accepted", "rejected"],
    default: "pending",
  }, // حالة الطلب
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

// Contact form - POST endpoint - للتواصل العام والاستفسارات
app.post("/api/contact", async (req, res) => {
  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database connection not available",
      });
    }

    const {
      contactName,
      contactEmail,
      contactPhone,
      contactSubject,
      contactMessage,
      contactType,
    } = req.body;

    if (!contactName || !contactEmail || !contactSubject || !contactMessage) {
      return res.status(400).json({
        success: false,
        message: "Name, email, subject, and message are required",
      });
    }

    const contact = new Contact({
      contactName,
      contactEmail,
      contactPhone,
      contactSubject,
      contactMessage,
      contactType,
    });
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

// Contact form - GET endpoint - استرجاع رسائل التواصل والاستفسارات
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

// Join form - POST endpoint - نموذج التقديم للوظائف
app.post("/api/join", async (req, res) => {
  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database connection not available",
      });
    }

    const {
      fullName,
      phoneNumber,
      email,
      jobPosition,
      experience,
      additionalMessage,
      cvFileName,
      cvPath,
    } = req.body;

    if (!fullName || !phoneNumber || !jobPosition) {
      return res.status(400).json({
        success: false,
        message: "Full name, phone number, and job position are required",
      });
    }

    const join = new Join({
      fullName,
      phoneNumber,
      email,
      jobPosition,
      experience,
      additionalMessage,
      cvFileName,
      cvPath,
    });
    await join.save();

    res.status(201).json({
      success: true,
      message: "Job application submitted successfully!",
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

// Join form - GET endpoint - استرجاع طلبات التوظيف
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
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 Contact form: http://localhost:${PORT}/api/contact`);
  console.log(`🤝 Join form: http://localhost:${PORT}/api/join`);

  // Wait a bit for MongoDB connection to establish
  setTimeout(() => {
    const mongoStatus =
      mongoose.connection.readyState === 1 ? "✅ Connected" : "❌ Disconnected";
    console.log(`🗄️ MongoDB: ${mongoStatus}`);
  }, 1000);
});

// Export for Vercel
module.exports = app;
