const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Health check example
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// Contact Form Schema - نموذج التواصل لخدمات حماية السيارة
const contactSchema = new mongoose.Schema({
  fullName: { type: String, required: true }, // الاسم الكامل *
  phoneNumber: { type: String, required: true }, // رقم الهاتف *
  carType: { type: String, required: true }, // نوع السيارة *
  carModel: { type: String, required: true }, // موديل السيارة *
  additionalNotes: { type: String, required: false }, // ملاحظات إضافية
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

// Contact form - POST endpoint - نموذج طلب خدمة حماية السيارة
app.post("/api/contact", async (req, res) => {
  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database connection not available",
      });
    }

    const { fullName, phoneNumber, carType, carModel, additionalNotes } =
      req.body;

    if (!fullName || !phoneNumber || !carType || !carModel) {
      return res.status(400).json({
        success: false,
        message:
          "Full name, phone number, car type, and car model are required",
      });
    }

    const contact = new Contact({
      fullName,
      phoneNumber,
      carType,
      carModel,
      additionalNotes,
    });
    await contact.save();

    res.status(201).json({
      success: true,
      message: "Car protection service request submitted successfully!",
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

// Contact form - GET endpoint - استرجاع طلبات خدمات حماية السيارة
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
  console.log(
    `🚗 Car protection service: http://localhost:${PORT}/api/contact`
  );
  console.log(`🤝 Join form: http://localhost:${PORT}/api/join`);

  // Check MongoDB connection status after a delay
  setTimeout(() => {
    if (mongoose.connection.readyState === 1) {
      console.log(`🗄️ MongoDB: ✅ Connected`);
      console.log(`📊 Database: royalNano`);
      console.log(`🌐 Cluster: ryoalnan`);
    } else {
      console.log(`🗄️ MongoDB: ❌ Disconnected - Check connection`);
    }
  }, 2000);
});

// Export for Vercel
module.exports = app;
