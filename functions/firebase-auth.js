import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

// Firebase Başlat
const app = initializeApp({
    apiKey: window.env.FIREBASE_API_KEY,
    authDomain: window.env.FIREBASE_AUTH_DOMAIN,
    projectId: window.env.FIREBASE_PROJECT_ID,
    storageBucket: window.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: window.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: window.env.FIREBASE_APP_ID
});

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Google Login Fonksiyonu
function googleLogin() {
    return signInWithPopup(auth, provider)
        .then((result) => {
            console.log("Giriş Başarılı:", result.user);
            localStorage.setItem("user", JSON.stringify(result.user));
            updateAuthButton(result.user);
            return result.user;
        })
        .catch(error => {
            console.error("Giriş Hatası:", error);
        });
}

// Google Logout Fonksiyonu
function googleLogout() {
    return signOut(auth)
        .then(() => {
            console.log("Çıkış Yapıldı");
            localStorage.removeItem("user");
            updateAuthButton(null);
        })
        .catch(error => {
            console.error("Çıkış Hatası:", error);
        });
}

// Auth Button Güncelleme Fonksiyonu
function updateAuthButton(user) {
    setTimeout(() => {
        const authButton = document.getElementById("auth-button");
        if (authButton) {
            console.log("✅ Buton bulundu! Güncelleniyor...");
            if (user) {
                authButton.textContent = "Çıkış Yap";
                authButton.classList.remove("bg-blue-500");
                authButton.classList.add("bg-red-500");
                authButton.onclick = googleLogout;
            } else {
                authButton.textContent = "Google ile Giriş Yap";
                authButton.classList.remove("bg-red-500");
                authButton.classList.add("bg-blue-500");
                authButton.onclick = googleLogin;
            }
        } else {
            console.error("❌ auth-button bulunamadı! Buton HTML içinde tanımlı mı?");
        }
    }, 1000); // 1 saniye gecikme ile butonu kontrol et
}

// Fonksiyonları Global Hale Getir
document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Sayfa yüklendi!");
    window.googleLogin = googleLogin;
    window.googleLogout = googleLogout;
    setTimeout(() => {
        updateAuthButton(JSON.parse(localStorage.getItem("user")));
    }, 1500); // Sayfa yüklenince 1.5 saniye bekleyip butonu güncelle
});
