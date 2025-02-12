// Firebase Config ve Authentication
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAJQqgl4Z9cNCw3p6I20IRPh4bQv9XC2EM",
  authDomain: "name-generator-8e116.firebaseapp.com",
  projectId: "name-generator-8e116",
  storageBucket: "name-generator-8e116.appspot.com",
  messagingSenderId: "444454352302",
  appId: "1:444454352302:web:271fcfba11485e525e843f",
  measurementId: "G-BE0NDB7RMC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Google ile giriş
function signInWithGoogle() {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      sessionStorage.setItem("userUID", user.uid);
      alert("Google ile giriş başarılı!");
    })
    .catch((error) => console.error("Google Giriş Hatası:", error));
}

// Misafir olarak giriş
function signInAnonymouslyUser() {
  signInAnonymously(auth)
    .then((result) => {
      const user = result.user;
      sessionStorage.setItem("userUID", user.uid);
      alert("Misafir olarak giriş yapıldı!");
    })
    .catch((error) => console.error("Anonim Giriş Hatası:", error));
}

// Kullanıcı UID'yi alıp backend'e göndermek için
function getUserUID() {
  return sessionStorage.getItem("userUID") || "guest";
}

// Ana sayfaya yönlendirme fonksiyonu
function goHome() {
    window.location.href = "index.html";
}

// Ana sayfada anahtar kelimeyi al ve yönlendir
function redirectToResults() {
    const keywords = document.getElementById("keywords").value.trim();
    if (keywords) {
        sessionStorage.setItem("keywords", keywords);
        window.location.href = "results.html";
    } else {
        alert("Please enter a keyword!");
    }
}

// API'den isim üretme ve sonuçları ekrana yerleştirme
async function generateNames() {
    const keywords = sessionStorage.getItem("keywords") || "Startup";
    const userUID = getUserUID();
    const resultsContainer = document.getElementById("results-container");
    const titleText = document.getElementById("results-title");
    
    try {
        const response = await fetch("/.netlify/functions/generate-name", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keywords, idToken: userUID })
        });
        
        const data = await response.json();
        if (data.names && data.names.length > 0) {
            resultsContainer.innerHTML = "";
            titleText.innerHTML = `Generated names for "<b>${keywords}</b>":`;
            
            data.names.forEach(name => {
                const card = document.createElement("div");
                card.className = "card";
                card.innerText = name;
                resultsContainer.appendChild(card);
            });
        } else {
            resultsContainer.innerHTML = "<p class='text-red-500'>No unique names available. Try again.</p>";
        }
    } catch (error) {
        console.error("API request error:", error);
    }
}

// Sayfa yüklendiğinde otomatik isim üret
if (window.location.pathname.includes("results.html")) {
    window.onload = generateNames;
}
