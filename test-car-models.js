const axios = require("axios");

const BASE_URL = "http://localhost:3000";

async function testCarModelsAPI() {
  console.log("🚗 Testing Car Models API...\n");

  try {
    // Test 1: Get BMW models
    console.log("1️⃣ Testing GET /api/car-models?brand=BMW");
    const bmwResponse = await axios.get(`${BASE_URL}/api/car-models?brand=BMW`);
    console.log("✅ Status:", bmwResponse.status);
    console.log("📊 BMW Models:", bmwResponse.data.data);
    console.log("📋 Count:", bmwResponse.data.count);
    console.log("");

    // Test 2: Search BMW models
    console.log("2️⃣ Testing GET /api/car-models?brand=BMW&q=X");
    const bmwSearchResponse = await axios.get(`${BASE_URL}/api/car-models?brand=BMW&q=X`);
    console.log("✅ Status:", bmwSearchResponse.status);
    console.log("🔍 BMW X Models:", bmwSearchResponse.data.data);
    console.log("📋 Count:", bmwSearchResponse.data.count);
    console.log("");

    // Test 3: Get Toyota models
    console.log("3️⃣ Testing GET /api/car-models?brand=Toyota");
    const toyotaResponse = await axios.get(`${BASE_URL}/api/car-models?brand=Toyota`);
    console.log("✅ Status:", toyotaResponse.status);
    console.log("📊 Toyota Models:", toyotaResponse.data.data);
    console.log("📋 Count:", toyotaResponse.data.count);
    console.log("");

    // Test 4: Get non-existent brand
    console.log("4️⃣ Testing GET /api/car-models?brand=NonExistent");
    const nonExistentResponse = await axios.get(`${BASE_URL}/api/car-models?brand=NonExistent`);
    console.log("✅ Status:", nonExistentResponse.status);
    console.log("📊 Non-existent brand result:", nonExistentResponse.data.data);
    console.log("📋 Count:", nonExistentResponse.data.count);
    console.log("");

    // Test 5: No brand parameter
    console.log("5️⃣ Testing GET /api/car-models (no brand)");
    const noBrandResponse = await axios.get(`${BASE_URL}/api/car-models`);
    console.log("✅ Status:", noBrandResponse.status);
    console.log("📊 No brand result:", noBrandResponse.data.data);
    console.log("📋 Count:", noBrandResponse.data.count);
    console.log("");

    console.log("🎉 All car models tests passed successfully!");

  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
  }
}

// Run the test
testCarModelsAPI();
