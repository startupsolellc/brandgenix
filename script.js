import { getDatabase, ref, get, set, update } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

const database = getDatabase();
const auth = getAuth();

//Yeni hash sistemi
// 🔹 1️⃣ Kullanıcı Hash Üretme Fonksiyonu 
async function generateUserHash() {
    const userData = `${navigator.userAgent}-${screen.width}x${screen.height}-${navigator.language}`;
    
    const encoder = new TextEncoder();
    const data = encoder.encode(userData);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
}

// 🔹 2️⃣ Firebase'e Kaydetme Fonksiyonu 
async function saveUserHashToFirebase() {
    const userHash = await generateUserHash();
    const userRef = ref(database, `browserGuests/${userHash}`);

    get(userRef).then(snapshot => {
        if (snapshot.exists()) {
            console.log("📌 Kullanıcı zaten var:", snapshot.val());
        } else {
            set(userRef, { generatedNames: 0 })
                .then(() => console.log("✅ Kullanıcı Firebase'e eklendi:", userHash))
                .catch(error => console.error("❌ Firebase yazma hatası:", error));
        }
    }).catch(error => console.error("❌ Firebase okuma hatası:", error));
}

// 🔹 3️⃣ İsim Üretim Limitini Kontrol Etme ve Güncelleme 
async function checkAndUpdateLimit() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            console.log("✅ Kullanıcı giriş yaptı, sınırsız üretim aktif:", user.email);
            return; // Giriş yapan kullanıcılar için limit kontrolünü atla
        } else {
            console.log("⚠️ Misafir kullanıcı, limit kontrolü aktif.");
            try {
                const userHash = await generateUserHash();
                const userRef = ref(database, `browserGuests/${userHash}`);

                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    let generatedNames = snapshot.val().generatedNames || 0;

                    if (generatedNames >= 25) {
                        console.warn("⚠️ İsim üretim sınırına ulaşıldı, yönlendirme başlıyor!");
                        setTimeout(() => {
                            window.location.href = "login-required.html";
                        }, 1000); // 1 saniye gecikme ile yönlendirme
                    } else {
                        await update(userRef, { generatedNames: generatedNames + 4 });
                        console.log(`✅ Yeni toplam: ${generatedNames + 4} isim üretildi.`);
                    }
                } else {
                    console.error("❌ Kullanıcı Firebase'de bulunamadı!");
                }
            } catch (error) {
                console.error("❌ Firebase işlem hatası:", error);
            }
        }
    });
}

// 🔹 4️⃣ Firebase'e Kaydetme İşlemini Başlat
saveUserHashToFirebase();

// 🔹 5️⃣ \"Create More\" Butonuna Tıklanınca Limit Kontrolünü Çalıştır
document.addEventListener("DOMContentLoaded", function () {
    const generateButton = document.getElementById("generate-new");
    if (generateButton) {
        generateButton.addEventListener("click", checkAndUpdateLimit);
        console.log("✅ 'Create More' butonu bulundu ve event listener eklendi!");
    } else {
        console.error("❌ 'Create More' butonu bulunamadı!");
    }
});

// Ana sayfaya yönlendirme fonksiyonu
function goHome() {
    window.location.href = "index.html";
}

// Önceden üretilen isimleri saklamak için değişken
let previousNames = new Set();
const netlifyFontsApiUrl = "/.netlify/functions/get-fonts"; // Netlify Functions API

// 🔹 Etiketleri saklamak için dizi (Eğer tanımlı değilse, tanımla)
if (typeof tags === "undefined") {
    var tags = [];
}

// 🔹 1️⃣ Etiket Ekleme Fonksiyonu
function handleKeyDown(event) {
    const input = event.target;
    const tagContainer = document.getElementById("tag-container");
    const errorMessage = document.getElementById("error-message");

    if (event.key === "Enter" && input.value.trim() !== "") {
        event.preventDefault();

        if (tags.length >= 5) {
            errorMessage.classList.remove("hidden");
            return;
        }

        tags.push(input.value.trim());
        input.value = "";
        errorMessage.classList.add("hidden");

        updateTags(tagContainer);
    }
}

// 🔹 2️⃣ Etiketleri Güncelleme Fonksiyonu
function updateTags(container) {
    container.innerHTML = "";
    tags.forEach((tag, index) => {
        const tagElement = document.createElement("div");
        tagElement.className = "tag bg-blue-500 text-white rounded-full px-3 py-1 flex items-center";
        tagElement.innerHTML = `${tag} <button class="ml-2 text-white" onclick="removeTag(${index})">✖</button>`;
        container.appendChild(tagElement);
    });

    const input = document.createElement("input");
    input.type = "text";
    input.id = "keywords-input";
    input.placeholder = "Enter keywords...";
    input.className = "flex-1 bg-transparent text-gray-700 text-lg border-none focus:outline-none px-4";
    input.onkeydown = handleKeyDown;
    container.appendChild(input);
}

// 🔹 3️⃣ Etiket Silme Fonksiyonu
function removeTag(index) {
    tags.splice(index, 1);
    updateTags(document.getElementById("tag-container"));
}

// API'den isim üretme ve sonuçları ekrana yerleştirme (Benzersiz isimler + Dinamik Font + Rastgele Renk)
async function generateNames() {
    const keywords = JSON.parse(sessionStorage.getItem("keywords")) || null;
    const selectedCategory = sessionStorage.getItem("category") || null; 
    const resultsContainer = document.getElementById("results-container");

    // 🔄 Loading Animasyonu Ekle (Tam Ortada)
    const loadingDiv = document.createElement("div");
    loadingDiv.className = "loading-container";
    loadingDiv.innerHTML = `<div class="spinner"></div>`;
    document.body.appendChild(loadingDiv);

    setTimeout(async () => {
        try {
            let uniqueNames = new Set();
            let attempts = 0;
            const maxAttempts = 5;
            const requestBody = keywords ? { keywords } : { category: selectedCategory };

            while (uniqueNames.size < 4 && attempts < maxAttempts) {
                const response = await fetch("/.netlify/functions/generate-name", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestBody)
                });

                const data = await response.json();

                if (data.names && data.names.length > 0) {
                    data.names.forEach(name => {
                        if (!previousNames.has(name) && uniqueNames.size < 4) {
                            uniqueNames.add(name);
                            previousNames.add(name);
                        }
                    });
                }
                attempts++;
            }

            document.body.removeChild(loadingDiv);

            if (uniqueNames.size > 0) {
                resultsContainer.innerHTML = "";

                [...uniqueNames].forEach(async (name, index) => {
                    const card = document.createElement("div");
                    const randomFont = await getRandomFont();
                    const randomColor = getRandomColor();
                    const contrastColor = getContrastColor(randomColor);
                    const link = document.createElement("link");
                    link.href = `https://fonts.googleapis.com/css2?family=${randomFont.replace(/ /g, '+')}&display=swap`;
                    link.rel = "stylesheet";
                    document.head.appendChild(link);

                    card.style.fontFamily = `"${randomFont}", sans-serif`;
                    card.style.backgroundColor = randomColor;
                    card.style.color = contrastColor;
                    card.className = "card cursor-pointer transition duration-300 hover:shadow-lg";
                    card.innerText = name;
                    resultsContainer.appendChild(card);

                    card.addEventListener("click", function () {
                        const selectedName = this.innerText.trim();
                        const selectedFont = randomFont; 
                        const selectedBgColor = randomColor; 
                        window.location.href = `/customize?name=${encodeURIComponent(selectedName)}&font=${encodeURIComponent(selectedFont)}&bgColor=${encodeURIComponent(selectedBgColor)}`;
                    });

                    setTimeout(() => {
                        card.classList.add("show");
                    }, 500 + index * 500);
                });
            } else {
                resultsContainer.innerHTML = "<p class='text-red-500'>No unique names available. Try again.</p>";
            }
        } catch (error) {
            console.error("API request error:", error);
            document.body.removeChild(loadingDiv);
        }
    }, 8000);
}

// 🔹 4️⃣ Sonuç Sayfasına Yönlendirme (Generate Name)
function redirectToResults() {
    console.log("✅ 'Generate Name' butonuna basıldı, yönlendirme başlıyor...");
    const selectedCategory = document.getElementById("category-select")?.value;

    if (tags.length >= 3 && tags.length <= 5) {
        sessionStorage.setItem("keywords", JSON.stringify(tags));
        sessionStorage.removeItem("category");
    } else if (selectedCategory) {
        sessionStorage.setItem("category", selectedCategory);
        sessionStorage.removeItem("keywords");
    } else {
        document.getElementById("error-message").classList.remove("hidden");
        return;
    }

    window.location.href = "results.html";
}


// 🔹 5️⃣ Hızlı Kategori Seçme Fonksiyonu
function selectCategory(category) {
    console.log(`✅ Hızlı kategori seçildi: ${category}`);
    sessionStorage.setItem("category", category);
    sessionStorage.removeItem("keywords");
    window.location.href = "results.html";
}

// 🔹 6️⃣ Sayfa Yüklenince Etiket ve Butonları Bağla
document.addEventListener("DOMContentLoaded", function () {
    console.log("🔄 Sayfa yükleniyor, elementler kontrol ediliyor...");

    // 🔸 Etiket giriş alanı
    const inputField = document.getElementById("keywords-input");
    if (inputField) {
        inputField.onkeydown = handleKeyDown;
        console.log("✅ Etiket giriş alanı bulundu ve event listener eklendi!");
    } else {
        console.error("❌ Etiket giriş alanı bulunamadı!");
    }

    // 🔸 "Generate Name" Butonunu Dinamik Olarak Bağla
    const generateButton = document.getElementById("generate-button");
    if (generateButton) {
        generateButton.addEventListener("click", redirectToResults);
        console.log("✅ 'Generate Name' butonu bulundu ve event listener eklendi!");
    } else {
        console.error("❌ 'Generate Name' butonu bulunamadı!");
    }

    // 🔸 Hızlı Kategori Butonları
    document.querySelectorAll(".category-button").forEach(button => {
        button.addEventListener("click", function () {
            selectCategory(this.dataset.category);
        });
    });

    // 🔹 Eğer sayfa results.html ise, generateNames fonksiyonunu çalıştır
    if (window.location.pathname.includes("results.html")) {
        console.log("🔄 Results sayfası tespit edildi, isim üretimi başlatılıyor...");
        generateNames();
    }
});


// Rastgele renk paleti
const colorPalette = [
    "#FFB6C1", "#FFDAB9", "#E6E6FA", "#FFFACD", "#D8BFD8", "#D3D3D3", "#FFC0CB", "#ADD8E6", "#F08080", "#FAFAD2",
    "#D4AF37", "#B5A642", "#C0C0C0", "#A9A9A9", "#708090", "#778899", "#B0C4DE", "#4682B4",
    "#5F9EA0", "#7B68EE", "#6A5ACD", "#4169E1", "#1E90FF", "#6495ED", "#2E8B57", "#228B22",
    "#8FBC8F", "#66CDAA", "#20B2AA", "#008080", "#556B2F", "#6B8E23", "#BDB76B", "#DAA520",
    "#CD853F", "#8B4513", "#A0522D", "#D2691E", "#BC8F8F", "#F4A460", "#C3B091", "#D2B48C",
    "#DEB887", "#A52A2A", "#8B0000", "#800000", "#B22222", "#DC143C", "#E9967A", "#FA8072",
    "#FF8C00", "#FF7F50", "#FFA07A", "#F08080", "#D3D3D3", "#C0C0C0", "#A9A9A9", "#696969",
    "#808080", "#333333"
];

// Rastgele renk seçme fonksiyonu
function getRandomColor() {
    return colorPalette[Math.floor(Math.random() * colorPalette.length)];
}

// Kontrast rengi belirleme fonksiyonu
function getContrastColor(bgColor) {
    const color = bgColor.charAt(0) === '#' ? bgColor.substring(1, 7) : bgColor;
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155 ? 'black' : 'white';
}

// Netlify Functions üzerinden rastgele font çekme
async function getRandomFont() {
    try {
        const response = await fetch(netlifyFontsApiUrl);
        const data = await response.json();

        if (data.fonts && data.fonts.length > 0) {
            return data.fonts[Math.floor(Math.random() * data.fonts.length)];
        }
    } catch (error) {
        console.error("Netlify Fonts API request failed:", error);
    }
    return "Arial"; // Hata olursa varsayılan font
}

// Kullanıcı giriş yaptı mı? Konsola yazdır
console.log("🔥 Kullanıcı oturum kontrolü çalışıyor...");

// Sayfa yüklendiğinde giriş kontrolü yapılacak
document.addEventListener("DOMContentLoaded", function () {
    console.log("🔍 Sayfa yüklendi. Kullanıcı durumu kontrol ediliyor...");

    // Firebase yüklendi mi kontrol et
    let checkFirebase = setInterval(() => {
        if (typeof getAuth === "function") {
            clearInterval(checkFirebase); // Firebase yüklendi, intervali durdur
            console.log("✅ Firebase Authentication yüklendi!");

            const auth = getAuth();

            // Kullanıcı durumu değiştiğinde kontrol et
            auth.onAuthStateChanged((user) => {
                if (user) {
                    console.log(`✅ Kullanıcı giriş yaptı: ${user.email}`);
                } else {
                    console.log("❌ Kullanıcı giriş yapmamış.");
                }
            });
        }
    }, 500);
});

// Header ve Footer'ı yükleme fonksiyonu
document.addEventListener("DOMContentLoaded", function () {
    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header-placeholder").innerHTML = data;

            setTimeout(() => {
                const menuButton = document.getElementById("mobile-menu-button");
                const mobileMenu = document.getElementById("mobile-menu");
                const desktopAuthButton = document.getElementById("auth-button");
                const mobileAuthButton = document.getElementById("mobile-auth-button");

                if (menuButton && mobileMenu) {
                    console.log("✅ Mobil menü butonu bulundu!");
                    menuButton.addEventListener("click", function () {
                        console.log("🎯 Mobil menü aç/kapat çalışıyor!");
                        mobileMenu.classList.toggle("show");
                    });
                } else {
                    console.error("❌ Mobil menü veya buton bulunamadı!");
                }

                // ✅ Giriş Durumunu Güncelle
                if (typeof updateAuthButton === "function") {
                    updateAuthButton(JSON.parse(localStorage.getItem("user")));
                } else {
                    console.error("❌ updateAuthButton fonksiyonu tanımlı değil!");
                }

            }, 500);
        })
        .catch(error => console.error("❌ Header yüklenirken hata oluştu:", error));

    fetch("footer.html")
        .then(response => response.text())
        .then(data => document.getElementById("footer-placeholder").innerHTML = data)
        .catch(error => console.error("❌ Footer yüklenirken hata oluştu:", error));
});
