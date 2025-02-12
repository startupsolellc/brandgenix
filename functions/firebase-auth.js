const admin = require("firebase-admin");

// Firebase Admin SDK'yı başlat
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
    });
}

/**
 * Kullanıcı UID'sini doğrulama fonksiyonu
 * @param {string} idToken - Kullanıcının Firebase kimlik doğrulama tokeni
 * @returns {Promise<string>} - Kullanıcının doğrulanmış UID'si
 */
async function verifyUser(idToken) {
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        return decodedToken.uid; // Kullanıcının doğrulanmış UID'si
    } catch (error) {
        console.error("❌ Firebase UID doğrulama hatası:", error);
        return null;
    }
}

module.exports = { verifyUser };
