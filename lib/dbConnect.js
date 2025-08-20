import mongoose from "mongoose";

const mongoUri = process.env.MONGO_URI;

// Validate MONGO_URI
if (!mongoUri) {
  console.error("❌ MONGO_URI environment variable is not set!");
  console.error("Please set MONGO_URI in your Vercel environment variables");
}

// Global cached connection for Serverless
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export default async function dbConnect() {
  if (cached.conn) {
    console.log("🔄 Using cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("🔌 Creating new MongoDB connection...");
    const opts = {
      bufferCommands: false, // Important for serverless to prevent buffering commands when disconnected
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
    cached.promise = null; // Reset promise on error to retry connection
    throw e;
  }
}
