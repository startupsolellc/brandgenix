import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js"; 
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

// Çevresel değişkenleri Netlify'dan oku
const firebaseConfig = {
    apiKey: window.env.FIREBASE_API_KEY,
    authDomain: window.env.FIREBASE_AUTH_DOMAIN,
    projectId: window.env.FIREBASE_PROJECT_ID,
    storageBucket: window.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: window.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: window.env.FIREBASE_APP_ID
};

// Firebase başlat
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Google Login Fonksiyonu
export function googleLogin() {
    return signInWithPopup(auth, provider)
        .then((result) => {
            console.log("Giriş Başarılı:", result.user);
            localStorage.setItem("user", JSON.stringify(result.user));
            return result.user;
        })
        .catch(error => {
            console.error("Giriş Hatası:", error);
        });
}

// Google Logout Fonksiyonu
export function googleLogout() {
    return signOut(auth)
        .then(() => {
            console.log("Çıkış Yapıldı");
            localStorage.removeItem("user");
        })
        .catch(error => {
            console.error("Çıkış Hatası:", error);
        });
}

// Kullanıcıyı Alma Fonksiyonu
export function getUser() {
    return JSON.parse(localStorage.getItem("user"));
}
