import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
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
