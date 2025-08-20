// Simple test script for API endpoints
const axios = require("axios");

const BASE_URL = "http://localhost:3000/api";

async function testAPI() {
  try {
    console.log("🧪 Testing Royal Nano Backend API...\n");

    // Test health check
    console.log("1. Testing Health Check...");
    const health = await axios.get(`${BASE_URL}/health`);
    console.log("✅ Health Check:", health.data);

    // Test contact form submission
    console.log("\n2. Testing Contact Form Submission...");
    const contactData = {
      fullName: "أحمد حسن",
      email: "ahmed@example.com",
      message: "مرحباً، أريد معلومات عن خدماتكم",
    };
    const contact = await axios.post(`${BASE_URL}/contact`, contactData);
    console.log("✅ Contact Form:", contact.data);

    // Test join form submission
    console.log("\n3. Testing Join Form Submission...");
    const joinData = {
      fullName: "محمد علي",
      phoneNumber: "+966501234567",
      carType: "سيدان",
    };
    const join = await axios.post(`${BASE_URL}/join`, joinData);
    console.log("✅ Join Form:", join.data);

    // Test retrieving contacts
    console.log("\n4. Testing Contact Retrieval...");
    const contacts = await axios.get(`${BASE_URL}/contact`);
    console.log(
      "✅ Contacts Retrieved:",
      contacts.data.data.length,
      "contacts"
    );

    // Test retrieving joins
    console.log("\n5. Testing Join Retrieval...");
    const joins = await axios.get(`${BASE_URL}/join`);
    console.log("✅ Joins Retrieved:", joins.data.data.length, "joins");

    console.log("\n🎉 All tests passed! API is working correctly.");
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI };
