const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");

// Import models
const Contact = require("./models/Contact");
const Join = require("./models/Join");
const User = require("./models/User");

// Import routes
const carBrandsRouter = require("./routes/carBrands");
const carModelsRouter = require("./routes/carModels");
const serviceTypesRouter = require("./routes/serviceTypes");

// Import Firebase
const { initializeFirebase, verifyFirebaseToken } = require("./lib/firebase");

const app = express();

// Initialize Firebase Admin SDK
try {
  initializeFirebase();
} catch (error) {
  console.warn("⚠️ Firebase initialization failed. User permissions API will not work.");
}

// إعدادات CORS نهائية - حل شامل ومحسن
app.use(
  cors({
    origin: "*", // السماح لجميع الدومينات
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Origin",
      "X-Requested-With",
      "Accept",
      "Cache-Control",
      "Pragma",
    ],
    optionsSuccessStatus: 200,
    preflightContinue: false,
    credentials: false,
  })
);

app.use(express.json());

// Routes
app.use("/api", carBrandsRouter);
app.use("/api", carModelsRouter);
app.use("/api", serviceTypesRouter);

// MongoDB Connection
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error("❌ MONGO_URI environment variable is not set!");
  console.error("Please set MONGO_URI in your Vercel environment variables");
}

// Global cached connection for Serverless
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectToDatabase() {
  if (cached.conn) {
    console.log("🔄 Using cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("🔌 Creating new MongoDB connection...");
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(mongoUri, opts)
      .then((mongoose) => {
        console.log("✅ MongoDB connected successfully");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection failed:", err.message);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    console.log("🔗 MongoDB connection established");
    return cached.conn;
  } catch (e) {
    console.error("💥 Connection error:", e.message);
    cached.promise = null;
    throw e;
  }
}

// Health check
app.get("/api/health", async (req, res) => {
  try {
    await connectToDatabase();
    res.json({
      success: true,
      message: "Server is running",
      mongodb: "connected",
      timestamp: new Date().toISOString(),
      connection: "cached",
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
    res.json({
      success: true,
      message: "Server is running",
      mongodb: "disconnected",
      timestamp: new Date().toISOString(),
      error: err.message,
      connection: "failed",
    });
  }
});

// Multer setup for file uploads (join form)
const upload = multer({ storage: multer.memoryStorage() });

// Contact API - Car Protection Service
app.post("/api/contact", async (req, res) => {
  try {
    await connectToDatabase();

    const { fullName, phoneNumber, carType, carModel, additionalNotes } = req.body;

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

// Join API - Job Application
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

// Uploadthing route is handled by Vercel API route at /api/upload

// User Permissions API - Firebase Authentication
app.get("/api/user/permissions", verifyFirebaseToken, async (req, res) => {
  try {
    await connectToDatabase();

    const firebaseUid = req.user.uid;

    if (!firebaseUid) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Find user in database
    const user = await User.findByFirebaseUid(firebaseUid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found in database",
        hint: "User needs to be registered in the system first",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "User account is inactive",
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Return user permissions
    return res.status(200).json({
      success: true,
      data: {
        userId: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        permissions: user.permissions,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error("❌ Get permissions error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
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
      upload: "POST /api/upload",
      carBrands: "GET /api/car-brands",
      carModels: "GET /api/car-models?brand=BMW",
      serviceTypes: "GET /api/service-types",
      userPermissions: "GET /api/user/permissions (requires Firebase token)",
      health: "GET /api/health",
    },
  });
});

// Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
  console.log(
    `🚗 Car protection service: http://localhost:${PORT}/api/contact`
  );
  console.log(`🤝 Join form: http://localhost:${PORT}/api/join`);
  console.log(`📤 File upload: http://localhost:${PORT}/api/upload`);
  console.log(`🚙 Car brands: http://localhost:${PORT}/api/car-brands`);
  console.log(`🚗 Car models: http://localhost:${PORT}/api/car-models?brand=BMW`);
  console.log(`🛡️ Service types: http://localhost:${PORT}/api/service-types`);
  console.log(`👤 User permissions: http://localhost:${PORT}/api/user/permissions`);
  console.log(`🗄️ MongoDB: Using connection caching for Vercel`);
  console.log(`📊 Database: royalNano`);
  console.log(`🌐 Cluster: ryoalnan`);
});

module.exports = app;
