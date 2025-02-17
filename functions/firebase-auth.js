import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "FIREBASE_API_KEY",
    authDomain: "PROJECT_ID.firebaseapp.com",
    projectId: "PROJECT_ID",
    storageBucket: "PROJECT_ID.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
};

// Firebase başlat
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Google Giriş Fonksiyonu
export function googleLogin() {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            console.log("Giriş Yapan Kullanıcı:", user);
            localStorage.setItem("user", JSON.stringify(user));
            window.location.reload(); // Sayfayı yenile
        })
        .catch((error) => {
            console.error("Giriş Hatası:", error);
        });
}

// Çıkış Fonksiyonu
export function googleLogout() {
    signOut(auth).then(() => {
        console.log("Çıkış yapıldı");
        localStorage.removeItem("user");
        window.location.reload();
    }).catch((error) => {
        console.error("Çıkış Hatası:", error);
    });
}

// Kullanıcı Bilgisini Alma
export function getUser() {
    return JSON.parse(localStorage.getItem("user"));
}
