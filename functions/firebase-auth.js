import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js"; 
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

// Firebase çevresel değişkenleri Netlify'dan al
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Firebase başlat
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Google Giriş Fonksiyonu
export function googleLogin(callback) {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            console.log("Giriş Yapan Kullanıcı:", user);
            localStorage.setItem("user", JSON.stringify(user));
            
            if (callback) callback(user); // Callback fonksiyonuna kullanıcı bilgisini ilet
        })
        .catch((error) => {
            console.error("Giriş Hatası:", error);
        });
}

// Çıkış Fonksiyonu
export function googleLogout(callback) {
    signOut(auth).then(() => {
        console.log("Çıkış yapıldı");
        localStorage.removeItem("user");
        
        if (callback) callback(); // Callback varsa çağır
    }).catch((error) => {
        console.error("Çıkış Hatası:", error);
    });
}

// Kullanıcı Bilgisini Alma (Senktron)
export function getUser() {
    return JSON.parse(localStorage.getItem("user"));
}

// Firebase Kullanıcı Durumunu Dinleme (Asenkron)
export function onAuthChange(callback) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("Kullanıcı oturum açtı:", user);
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            console.log("Kullanıcı oturumu kapattı");
            localStorage.removeItem("user");
        }
        if (callback) callback(user);
    });
}
