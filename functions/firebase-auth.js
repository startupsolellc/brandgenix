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

