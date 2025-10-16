// ✅ Shield Token API with CORS fix

export default async function handler(req, res) {
  // ----------------------------
  // 1️⃣ إعداد CORS Headers
  // ----------------------------
  const allowedOrigins = [
    'http://localhost:4200',       // Angular dev
    'http://localhost:64923',      // منفذك الحالي
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

  // ✅ رد فوري على preflight request (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ----------------------------
  // 2️⃣ من هنا منطق الشغل الأساسي
  // ----------------------------
  try {
    // مثال توضيحي: استخرج الـ token من الهيدر
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    // ⚙️ تحقق أو تعامل مع الـ token هنا (اختياري)
    // مثال تجريبي: نرجع بيانات افتراضية
    return res.status(200).json({
      success: true,
      message: 'Shield token verified successfully',
      token: token.substring(0, 10) + '...', // جزء بسيط من التوكن فقط للعرض
    });
  } catch (error) {
    console.error('Shield token error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
}

