const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Accept only PDF, DOC, DOCX files
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/msword" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, and DOCX files are allowed!"), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// API Routes

// Contact form endpoint
app.post("/api/contact", (req, res) => {
  try {
    const { fullName, phoneNumber, carType, carModel, notes } = req.body;

    // Validate required fields
    if (!fullName || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Full name and phone number are required",
      });
    }

    // Log the contact form data
    console.log("=== Contact Form Submission ===");
    console.log("Full Name:", fullName);
    console.log("Phone Number:", phoneNumber);
    console.log("Car Type:", carType || "Not specified");
    console.log("Car Model:", carModel || "Not specified");
    console.log("Notes:", notes || "No notes");
    console.log("Timestamp:", new Date().toISOString());
    console.log("==============================");

    res.json({
      success: true,
      message: "Contact form received",
    });
  } catch (error) {
    console.error("Error in contact endpoint:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Join form endpoint with CV upload
app.post("/api/join", upload.single("cv"), (req, res) => {
  try {
    const { fullName, phoneNumber, email, position, experience, message } =
      req.body;
    const cvFile = req.file;

    // Validate required fields
    if (!fullName || !phoneNumber || !email || !position) {
      return res.status(400).json({
        success: false,
        message: "Full name, phone number, email, and position are required",
      });
    }

    // Check if CV file was uploaded
    if (!cvFile) {
      return res.status(400).json({
        success: false,
        message: "CV file is required",
      });
    }

    // Log the join form data
    console.log("=== Join Form Submission ===");
    console.log("Full Name:", fullName);
    console.log("Phone Number:", phoneNumber);
    console.log("Email:", email);
    console.log("Position:", position);
    console.log("Experience:", experience || "Not specified");
    console.log("Message:", message || "No message");
    console.log("CV File:", cvFile.filename);
    console.log("CV Original Name:", cvFile.originalname);
    console.log("CV Size:", (cvFile.size / 1024).toFixed(2) + " KB");
    console.log("Timestamp:", new Date().toISOString());
    console.log("============================");

    res.json({
      success: true,
      message: "Join form received",
      cv: cvFile.filename,
    });
  } catch (error) {
    console.error("Error in join endpoint:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Error handling middleware for multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size too large. Maximum size is 5MB",
      });
    }
  }

  if (error.message === "Only PDF, DOC, and DOCX files are allowed!") {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  next(error);
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
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

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Uploads directory: ${uploadsDir}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
