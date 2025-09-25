const express = require("express");
const router = express.Router();

const carBrands = [
  "Abarth","Acura","Alfa Romeo","Arcfox","Aston Martin","Audi","Avatr","Baic","Bajaj",
  "Benelli","Bentley","Borgward","Brilliance","Bugatti","Buick","BYD","Cadillac","Chana",
  "Changan","Canghe","Chery","Chevrolet","Chrysle","Citroën","Cupra","Daewoo","Daihatsu",
  "Datsun","DFSK","Dodge","Dongfeng","Ds","Emgrand","Exeed","Ferrari","Fiat","Ford","Foton",
  "GAC","GMC","Geely","Genesis","Great Wall","Hafei","Haima","Haval","Humme","Hyundai","Ineos",
  "Infiniti","Isuzu","Jaguar","Jeep","Jetour","JMC","Kia","Koenigsegg","Lada","Lamborghini",
  "Land Rover","Lexus","Lincoln","Lotus","Lynk & Co","Mahindra","Maserati","Mazda","Mercedes",
  "MG","Mini","Mitsubishi","Nissan","Noble","Opel","Peugeot","Porsche","Proton","Renault",
  "Rolls Royce","Saab","SsangYong","Subaru","Suzuki","Tesla","Toyota","Volkswagen","Volvo","Zotye"
];

router.get("/car-brands", (req, res) => {
  // إعدادات CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma"
  );

  // معالجة preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    const search = req.query.q?.toLowerCase() || "";
    const results = carBrands.filter(brand =>
      brand.toLowerCase().startsWith(search)
    );

    res.status(200).json({
      success: true,
      message: "Car brands retrieved successfully",
      data: results,
      count: results.length,
      total: carBrands.length
    });
  } catch (error) {
    console.error("Car brands error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
});

module.exports = router;
