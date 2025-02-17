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
            updateAuthButton(result.user);
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
            updateAuthButton(null);
        })
        .catch(error => {
            console.error("Çıkış Hatası:", error);
        });
}

// Kullanıcıyı Alma Fonksiyonu
export function getUser() {
    return JSON.parse(localStorage.getItem("user"));
}

// Auth Button Güncelleme Fonksiyonu
function updateAuthButton(user) {
    const authButton = document.getElementById("auth-button");
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
}

// Dil Değiştirici Tıklama Olayı
document.getElementById("lang-switcher").addEventListener("click", () => {
    const langSwitcher = document.getElementById("lang-switcher");
    if (langSwitcher.textContent === "EN") {
        langSwitcher.textContent = "TR";
    } else {
        langSwitcher.textContent = "EN";
    }
});

// Sayfa Yüklendiğinde Auth Button Güncelle
export function setupAuthUI() {
    const user = getUser();
    updateAuthButton(user);
}

window.googleLogin = googleLogin;
window.googleLogout = googleLogout;
console.log(window.getUser);
