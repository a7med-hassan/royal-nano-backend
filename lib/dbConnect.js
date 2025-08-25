const mongoose = require("mongoose");

const mongoUri = process.env.MONGO_URI;

// Global cached connection for Serverless
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // Check if MONGO_URI exists
  if (!mongoUri) {
    console.error("❌ MONGO_URI environment variable is not set!");
    console.error("Please set MONGO_URI in your Vercel environment variables");
    throw new Error("MONGO_URI not configured");
  }

  if (cached.conn) {
    console.log("🔄 Using cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("🔌 Creating new MongoDB connection...");
    const opts = {
      bufferCommands: false, // Important for serverless to prevent buffering commands when disconnected
      maxPoolSize: 1, // Limit connection pool for serverless
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      socketTimeoutMS: 45000, // 45 second timeout
    };

    cached.promise = mongoose
      .connect(mongoUri, opts)
      .then((mongoose) => {
        console.log("✅ MongoDB connected successfully");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection failed:", err.message);
        cached.promise = null; // Reset promise on error
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    console.log("🔗 MongoDB connection established");
    return cached.conn;
  } catch (e) {
    console.error("💥 Connection error:", e.message);
    cached.promise = null; // Reset promise on error to retry connection
    throw e;
  }
}

module.exports = dbConnect;
