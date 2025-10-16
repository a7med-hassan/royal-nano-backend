// ✅ Shield Token API - Generate OTAT for Royal Shield Dashboard

const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
  });
}

module.exports = async (req, res) => {
  // ----------------------------
  // 1️⃣ إعداد CORS Headers
  // ----------------------------
  const allowedOrigins = [
    'http://localhost:4200',
    'http://localhost:64923',
    'https://royalnanoceramic.com',
    'https://www.royalnanoceramic.com',
    'https://royalshieldworld.com',
    'https://www.royalshieldworld.com'
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // ✅ رد فوري على preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ----------------------------
  // 2️⃣ المنطق الرئيسي - إنشاء OTAT
  // ----------------------------
  try {
    // استخراج Firebase token من الهيدر أو الـ body
    let firebaseToken = req.headers.authorization?.split(' ')[1];
    
    // لو مش موجود في الهيدر، جرب في الـ body
    if (!firebaseToken && req.body?.firebaseToken) {
      firebaseToken = req.body.firebaseToken;
    }

    if (!firebaseToken) {
      return res.status(400).json({
        success: false,
        message: 'Missing Firebase token',
      });
    }

    // 🔹 تحقق من صلاحية توكن Firebase
    const decoded = await admin.auth().verifyIdToken(firebaseToken);

    if (!decoded || !decoded.uid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Firebase token',
      });
    }

    // 🔹 أنشئ توكن مؤقت (OTAT) لفتح رويال شيلد
    const SHIELD_SECRET = process.env.SHIELD_SECRET_KEY || process.env.JWT_SECRET || 'royal-shield-secret-2024';
    
    const otat = jwt.sign(
      { 
        uid: decoded.uid, 
        email: decoded.email, 
        name: decoded.name,
        role: 'admin',
        type: 'shield-access'
      },
      SHIELD_SECRET,
      { expiresIn: '5m' } // مدة قصيرة للأمان
    );

    return res.status(200).json({
      success: true,
      message: 'Shield token generated successfully',
      otat,
      expiresIn: '5m',
      user: {
        uid: decoded.uid,
        email: decoded.email,
        name: decoded.name
      }
    });
  } catch (error) {
    console.error('Shield token error:', error);
    
    // تحديد نوع الخطأ
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        message: 'Firebase token expired',
      });
    }
    
    if (error.code === 'auth/argument-error') {
      return res.status(400).json({
        success: false,
        message: 'Invalid token format',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to generate Shield token',
      error: error.message,
    });
  }
};
