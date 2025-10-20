// ✅ Shield Token API - Generate OTAT for Royal Shield Dashboard

const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");
const { setupCors } = require("../../lib/cors");

// Global cached Firebase instance for Vercel
if (!global.firebaseAdmin) {
  try {
    if (admin.apps.length === 0 && process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      global.firebaseAdmin = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("✅ Firebase Admin initialized for shield-token");
    } else if (admin.apps.length > 0) {
      global.firebaseAdmin = admin.app();
    }
  } catch (error) {
    console.error("❌ Firebase initialization error:", error.message);
  }
}

module.exports = async (req, res) => {
  // ----------------------------
  // 1️⃣ إعداد CORS Headers (يجب أن تكون أول شيء)
  // ----------------------------
  if (setupCors(req, res)) {
    return; // Handle preflight request
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

    // Get Firebase app instance
    const app = global.firebaseAdmin || (admin.apps.length > 0 ? admin.app() : null);
    
    if (!app) {
      console.error("❌ Firebase not initialized");
      return res.status(500).json({
        success: false,
        message: 'Firebase not configured',
      });
    }

    // 🔹 تحقق من صلاحية توكن Firebase
    const decoded = await admin.auth(app).verifyIdToken(firebaseToken);

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
        name: decoded.name || decoded.email,
        role: 'admin',
        type: 'shield-access',
        iat: Math.floor(Date.now() / 1000)
      },
      SHIELD_SECRET,
      { expiresIn: '5m' }
    );

    return res.status(200).json({
      success: true,
      message: 'Shield token generated successfully',
      otat,
      expiresIn: '5m',
      user: {
        uid: decoded.uid,
        email: decoded.email,
        name: decoded.name || decoded.email
      }
    });
  } catch (error) {
    console.error('❌ Shield token error:', error);
    
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
