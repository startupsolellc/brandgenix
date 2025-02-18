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
        const desktopAuthButton = document.getElementById("auth-button");
        const mobileAuthButton = document.getElementById("mobile-auth-button");

        if (desktopAuthButton) {
            if (user) {
                desktopAuthButton.textContent = "Çıkış Yap";
                desktopAuthButton.classList.remove("bg-blue-500");
                desktopAuthButton.classList.add("bg-red-500");
                desktopAuthButton.onclick = googleLogout;
            } else {
                desktopAuthButton.textContent = "Google ile Giriş Yap";
                desktopAuthButton.classList.remove("bg-red-500");
                desktopAuthButton.classList.add("bg-blue-500");
                desktopAuthButton.onclick = googleLogin;
            }
        }

        if (mobileAuthButton) {
            if (user) {
                mobileAuthButton.textContent = "Çıkış Yap";
                mobileAuthButton.classList.remove("bg-blue-500");
                mobileAuthButton.classList.add("bg-red-500");
                mobileAuthButton.onclick = googleLogout;
            } else {
                mobileAuthButton.textContent = "Google ile Giriş Yap";
                mobileAuthButton.classList.remove("bg-red-500");
                mobileAuthButton.classList.add("bg-blue-500");
                mobileAuthButton.onclick = googleLogin;
            }
        }
    }, 500); // DOM'un tamamen yüklendiğinden emin olmak için bekletiyoruz
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
window.updateAuthButton = updateAuthButton;

import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

// Firebase Realtime Database bağlantısını başlat
const database = getDatabase();

// Kullanıcıyı Firebase'e Kaydetme Fonksiyonu
console.log("saveUserToDatabase fonksiyonu çalıştı - FONKSİYON BAŞLANGICI"); // EKLEDİĞİMİZ SATIR 1
function saveUserToDatabase(user) {
    console.log("saveUserToDatabase fonksiyonu içinde - PARAMETRE:", user); // EKLEDİĞİMİZ SATIR 2
    if (!user) {
        console.log("saveUserToDatabase - USER PARAMETRESİ BOŞ, KAYDETME İŞLEMİ İPTAL EDİLDİ"); // EKLEDİĞİMİZ SATIR 3
        return;
    }

    const userRef = ref(database, 'users/' + user.uid);
    console.log("✅ Veri Yolu (userRef):", userRef.toString()); // EKLEDİĞİMİZ SATIR 4 - VERİ YOLU KONSOLA YAZDIRILIYOR
    set(userRef, {
        email: user.email,
        generatedNames: 0,
        downloads: 0,
        isPremium: false
    }).then(() => {
        console.log("✅ Kullanıcı Firebase'e kaydedildi:", user.email);
    }).catch(error => {
        console.error("❌ Kullanıcı Firebase'e kaydedilemedi:", error);
        console.error("❌ HATA DETAYI:", error.code, error.message, error.details); // EKLEDİĞİMİZ SATIR 5 - DETAYLI HATA MESAJI
    });
    console.log("saveUserToDatabase fonksiyonu SONU"); // EKLEDİĞİMİZ SATIR 6
}

// Google Login Fonksiyonunu Firebase'e Kaydetme ile Güncelle
const originalGoogleLogin = googleLogin; // Mevcut googleLogin fonksiyonunu sakla

googleLogin = function () {
    return originalGoogleLogin().then(user => {
        console.log("✅ googleLogin BAŞARILI, şimdi saveUserToDatabase ÇAĞRILIYOR"); // EKLEDİĞİMİZ SATIR 7
        saveUserToDatabase(user);
        return user;
    });
};
