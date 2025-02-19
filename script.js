import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
import { GuestManager } from './functions/guest-manager.js';
import { database } from './functions/firebase-auth.js';

// GuestManager'ı başlat
const guestManager = new GuestManager(database);

// ... (diğer değişkenler ve fonksiyonlar aynı kalacak)

// API'den isim üretme ve sonuçları ekrana yerleştirme
async function generateNames() {
    // Önce kullanım hakkını kontrol et
    const canGenerate = await guestManager.checkUsageLimit();
    
    if (!canGenerate) {
        alert("Ücretsiz kullanım hakkınız dolmuştur. Devam etmek için lütfen giriş yapın.");
        window.location.href = '/login-required.html';
        return;
    }

    const keywords = JSON.parse(sessionStorage.getItem("keywords")) || null;
    const selectedCategory = sessionStorage.getItem("category") || null;
    const resultsContainer = document.getElementById("results-container");

    // Loading Animasyonu
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
                // İsim üretme başarılı olduysa kullanım sayısını artır
                await guestManager.incrementUsage();

                // Kalan hakkı al
                const remaining = await guestManager.getRemainingGenerations();

                // Kalan hak bilgisini göster
                const remainingDiv = document.createElement("div");
                remainingDiv.className = "text-center text-gray-600 mt-4";
                remainingDiv.textContent = `Kalan ücretsiz hakkınız: ${remaining}`;
                resultsContainer.appendChild(remainingDiv);

                // İsimleri göster
                resultsContainer.innerHTML = "";
                resultsContainer.appendChild(remainingDiv);

                [...uniqueNames].forEach(async (name, index) => {
                    const card = document.createElement("div");
                    const randomFont = await getRandomFont();
                    const randomColor = getRandomColor();
                    const contrastColor = getContrastColor(randomColor);
                    const link = document.createElement("link");
                    link.href = `https://fonts.googleapis.com/css2?family=${randomFont.replace(/ /g, '+')}`;
                    link.rel = "stylesheet";
                    document.head.appendChild(link);

                    card.style.fontFamily = `"${randomFont}", sans-serif`;
                    card.style.backgroundColor = randomColor;
                    card.style.color = contrastColor;
                    card.className = "card cursor-pointer transition duration-300 hover:shadow-lg";
                    card.innerText = name;
                    resultsContainer.appendChild(card);

                    card.addEventListener("click", function() {
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
                resultsContainer.innerHTML = "<p class='text-red-500'>Benzersiz isim bulunamadı. Tekrar deneyin.</p>";
            }
        } catch (error) {
            console.error("API isteği hatası:", error);
            document.body.removeChild(loadingDiv);
        }
    }, 8000);
}

// Kategori seçimi için fonksiyon
window.selectCategory = function(category) {
    sessionStorage.setItem("category", category);
    sessionStorage.removeItem("keywords");
    window.location.href = "results.html";
};

// Sonuç sayfasına yönlendirme
function redirectToResults() {
    const selectedCategory = document.getElementById("category-select").value;

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

// Sayfa yüklendiğinde sonuçları üret
if (window.location.pathname.includes("results.html")) {
    window.onload = generateNames;
}

// "Generate New" butonuna tıklama olayını dinle
document.addEventListener("DOMContentLoaded", function () {
    const generateNewButton = document.getElementById("generate-new");
    if (generateNewButton) {
        generateNewButton.addEventListener("click", generateNames);
    }
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
