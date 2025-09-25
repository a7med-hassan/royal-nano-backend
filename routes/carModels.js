const express = require("express");
const router = express.Router();

// بيانات وهمية للموديلات (تقدر تحط بيانات من DB)
const carModels = {
  BMW: ["X1", "X2", "X3", "X4", "X5", "X6", "X7", "i3", "i8"],
  Audi: ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q5", "Q7", "Q8"],
  Toyota: ["Corolla", "Camry", "RAV4", "Land Cruiser", "Hilux"],
  Mercedes: ["A-Class", "C-Class", "E-Class", "S-Class", "GLA", "GLC", "GLE", "GLS"],
  Nissan: ["Altima", "Sentra", "Maxima", "Rogue", "Pathfinder", "Armada"],
  Honda: ["Civic", "Accord", "CR-V", "Pilot", "HR-V", "Passport"],
  Hyundai: ["Elantra", "Sonata", "Tucson", "Santa Fe", "Palisade", "Kona"],
  Kia: ["Forte", "Optima", "Sportage", "Sorento", "Telluride", "Soul"],
  Ford: ["Focus", "Fusion", "Escape", "Explorer", "Expedition", "F-150"],
  Chevrolet: ["Cruze", "Malibu", "Equinox", "Traverse", "Tahoe", "Silverado"],
  Volkswagen: ["Jetta", "Passat", "Tiguan", "Atlas", "Golf", "Beetle"],
  Lexus: ["IS", "ES", "GS", "LS", "NX", "RX", "GX", "LX"],
  Infiniti: ["Q50", "Q60", "Q70", "QX50", "QX60", "QX80"],
  Acura: ["ILX", "TLX", "RLX", "RDX", "MDX", "NSX"],
  Mazda: ["Mazda3", "Mazda6", "CX-3", "CX-5", "CX-9", "MX-5"],
  Subaru: ["Impreza", "Legacy", "Outback", "Forester", "Ascent", "WRX"],
  Volvo: ["S60", "S90", "XC40", "XC60", "XC90", "V60", "V90"],
  Jaguar: ["XE", "XF", "XJ", "F-PACE", "E-PACE", "I-PACE"],
  Land: ["Range Rover", "Range Rover Sport", "Range Rover Evoque", "Discovery", "Defender"],
  Porsche: ["911", "718", "Panamera", "Macan", "Cayenne", "Taycan"],
  Ferrari: ["488", "F8", "812", "SF90", "Roma", "Portofino"],
  Lamborghini: ["Huracán", "Aventador", "Urus"],
  Bentley: ["Continental", "Flying Spur", "Bentayga"],
  Rolls: ["Ghost", "Wraith", "Dawn", "Cullinan"],
  Tesla: ["Model S", "Model 3", "Model X", "Model Y", "Roadster"],
  Genesis: ["G70", "G80", "G90", "GV70", "GV80"],
  Alfa: ["Giulia", "Stelvio", "4C"],
  Maserati: ["Ghibli", "Quattroporte", "Levante", "MC20"],
  McLaren: ["570S", "720S", "GT", "Artura"],
  Aston: ["DB11", "Vantage", "DBS", "DBX"]
};

router.get("/car-models", (req, res) => {
  // إعدادات CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma");

  // معالجة preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    const brand = req.query.brand;
    const q = (req.query.q || "").toLowerCase();

    if (!brand || !carModels[brand]) {
      return res.status(200).json({
        success: true,
        message: "Brand not found or no brand specified",
        data: [],
        count: 0,
        brand: brand || null
      });
    }

    const models = carModels[brand].filter(model =>
      model.toLowerCase().startsWith(q)
    );

    res.status(200).json({
      success: true,
      message: "Car models retrieved successfully",
      data: models,
      count: models.length,
      total: carModels[brand].length,
      brand: brand
    });
  } catch (error) {
    console.error("Car models error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
});

module.exports = router;
