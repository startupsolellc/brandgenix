// Firebase Config ve Authentication (Tarayıcı Uyumlu Sürüm)

// Firebase SDK'yı script olarak yüklüyoruz
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Firebase başlatma
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

// Google ile giriş
function signInWithGoogle() {
  auth.signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      sessionStorage.setItem("userUID", user.uid);
      alert("Google ile giriş başarılı!");
    })
    .catch((error) => console.error("Google Giriş Hatası:", error));
}

// Misafir olarak giriş
function signInAnonymouslyUser() {
  auth.signInAnonymously()
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

// Sayfa yüklendiğinde otomatik isim üret
if (window.location.pathname.includes("results.html")) {
    window.onload = generateNames;
}
