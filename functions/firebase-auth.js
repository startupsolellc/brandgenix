import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

// Firebase Yapılandırması
const app = initializeApp({
    apiKey: window.env.FIREBASE_API_KEY,
    authDomain: window.env.FIREBASE_AUTH_DOMAIN,
    projectId: window.env.FIREBASE_PROJECT_ID,
    storageBucket: window.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: window.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: window.env.FIREBASE_APP_ID,
    databaseURL: "https://brandgenixapp-default-rtdb.europe-west1.firebasedatabase.app" // ✅ Doğru bölge adresi!
});
console.log("✅ Firebase Config from window.env:", window.env);

// Firebase servislerini başlat
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const database = getDatabase(app);

// Database bağlantı kontrolü
if (!database) {
    console.error("❌ Database bağlantısı başarısız!");
} else {
    console.log("✅ Database bağlantısı başarılı!");
}

// Kullanıcı kaydetme fonksiyonu
async function saveUserToDatabase(user) {
    console.log("💡 saveUserToDatabase başladı", user);
    
    if (!user || !user.uid || !user.email) {
        console.error("❌ Geçersiz kullanıcı verisi:", user);
        return null;
    }

    const userRef = ref(database, 'users/' + user.uid);
    
    const userData = {
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        generatedNames: 0,
        downloads: 0,
        isPremium: false,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString()
    };

    console.log("💡 Kaydedilecek veri:", userData);
    console.log("💡 Kayıt yolu:", userRef.toString());

    try {
        await set(userRef, userData);
        console.log("✅ Kullanıcı başarıyla kaydedildi:", user.email);
        return userData;
    } catch (error) {
        console.error("❌ Kayıt hatası:", error);
        console.error("❌ Hata detayı:", {
            code: error.code,
            message: error.message,
            ref: userRef.toString(),
            userData: userData
        });
        throw error;
    }
}

// Google Login fonksiyonu
async function googleLogin() {
    try {
        const result = await signInWithPopup(auth, provider);
        console.log("✅ Google Login başarılı:", result.user);
        
        // LocalStorage'a kaydet
        localStorage.setItem("user", JSON.stringify(result.user));
        
        // Database'e kaydet
        await saveUserToDatabase(result.user);
        
        // UI güncelle
        updateAuthButton(result.user);
        
        return result.user;
    } catch (error) {
        console.error("❌ Login hatası:", error);
        throw error;
    }
}

// Google Logout fonksiyonu
async function googleLogout() {
    try {
        await signOut(auth);
        console.log("✅ Başarıyla çıkış yapıldı");
        localStorage.removeItem("user");
        updateAuthButton(null);
    } catch (error) {
        console.error("❌ Çıkış hatası:", error);
        throw error;
    }
}

// Auth Button güncelleme fonksiyonu
function updateAuthButton(user) {
    setTimeout(() => {
        const desktopAuthButton = document.getElementById("auth-button");
        const mobileAuthButton = document.getElementById("mobile-auth-button");

        const updateButton = (button) => {
            if (!button) return;
            
            if (user) {
                button.textContent = "Çıkış Yap";
                button.classList.remove("bg-blue-500");
                button.classList.add("bg-red-500");
                button.onclick = googleLogout;
            } else {
                button.textContent = "Google ile Giriş Yap";
                button.classList.remove("bg-red-500");
                button.classList.add("bg-blue-500");
                button.onclick = googleLogin;
            }
        };

        updateButton(desktopAuthButton);
        updateButton(mobileAuthButton);
    }, 500);
}

// Sayfa yüklendiğinde
document.addEventListener("DOMContentLoaded", function() {
    console.log("✅ Sayfa yüklendi!");
    
    // Fonksiyonları global scope'a ekle
    window.googleLogin = googleLogin;
    window.googleLogout = googleLogout;
    window.updateAuthButton = updateAuthButton;
    
    // LocalStorage'dan kullanıcı durumunu kontrol et ve UI'ı güncelle
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
        console.log("💡 Kayıtlı kullanıcı bulundu:", savedUser.email);
        updateAuthButton(savedUser);
    }
});

// Auth state değişikliklerini dinle
auth.onAuthStateChanged((user) => {
    console.log("🔄 Auth durumu değişti:", user ? "Giriş yapıldı" : "Çıkış yapıldı");
    updateAuthButton(user);
});
export { database };
