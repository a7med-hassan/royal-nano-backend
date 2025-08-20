const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with Caching for Serverless
const mongoUri = process.env.MONGO_URI;

// Global cached connection for Serverless
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((mongoose) => {
        return mongoose;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Health check with database connection
app.get("/api/health", async (req, res) => {
  try {
    await connectToDatabase();
    res.json({
      success: true,
      message: "Server is running",
      mongodb: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
    res.json({
      success: true,
      message: "Server is running",
      mongodb: "disconnected",
      timestamp: new Date().toISOString(),
    });
  }
});

// Multer setup for file uploads (join form)
const upload = multer({ storage: multer.memoryStorage() });

// Routes
app.post("/api/contact", async (req, res) => {
  try {
    await connectToDatabase();

    const { fullName, phoneNumber, carType, carModel, notes } = req.body;

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
      notes,
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

app.get("/api/contact", async (req, res) => {
  try {
    await connectToDatabase();

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

app.post("/api/join", upload.single("cv"), async (req, res) => {
  try {
    await connectToDatabase();

    const {
      fullName,
      phoneNumber,
      email,
      jobPosition,
      experience,
      additionalMessage,
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
      cvFileName: req.file ? req.file.originalname : null,
      cvPath: req.file ? `/uploads/cv/${req.file.originalname}` : null,
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

app.get("/api/join", async (req, res) => {
  try {
    await connectToDatabase();

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

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
  console.log(
    `🚗 Car protection service: http://localhost:${PORT}/api/contact`
  );
  console.log(`🤝 Join form: http://localhost:${PORT}/api/join`);
  console.log(`🗄️ MongoDB: Using connection caching for Vercel`);
  console.log(`📊 Database: royalNano`);
  console.log(`🌐 Cluster: ryoalnan`);
});

module.exports = app;
