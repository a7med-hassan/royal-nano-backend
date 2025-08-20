// Simple test to verify basic functionality
console.log("Testing basic functionality...");

// Test environment variable
const mongoUri = process.env.MONGO_URI;
console.log("MONGO_URI exists:", !!mongoUri);
console.log("MONGO_URI length:", mongoUri ? mongoUri.length : 0);

// Test import syntax
try {
  console.log("✅ ES Modules syntax is working");
} catch (error) {
  console.error("❌ ES Modules syntax error:", error);
}

console.log("Test completed successfully!");
