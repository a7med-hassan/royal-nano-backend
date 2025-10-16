// api/user/permissions.js
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
  });
}

const db = admin.firestore();

module.exports = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);

    const userDoc = await db.collection("users").doc(decoded.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ success: false, message: "User not found in Firestore" });
    }

    const userData = userDoc.data();
    return res.status(200).json({
      success: true,
      data: {
        uid: decoded.uid,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        permissions: userData.permissions || {}
      }
    });
  } catch (error) {
    console.error("Error getting user permissions:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}


