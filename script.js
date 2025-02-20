// Ana sayfaya yönlendirme fonksiyonu
function goHome() {
    window.location.href = "index.html";
}

// Önceden üretilen isimleri saklamak için değişken
let previousNames = new Set();
const netlifyFontsApiUrl = "/.netlify/functions/get-fonts"; // Netlify Functions API

// Etiketleri saklamak için değişken
let tags = [];

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

// Etiket ekleme fonksiyonu
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

// Etiketleri güncelleme fonksiyonu
function updateTags(container) {
    container.innerHTML = "";
    tags.forEach((tag, index) => {
        const tagElement = document.createElement("div");
        tagElement.className = "tag bg-blue-500 text-white rounded-full px-3 py-1 flex items-center";
        tagElement.innerHTML = `${tag} <button class="ml-2" onclick="removeTag(${index})">X</button>`;
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

// Etiket kaldırma fonksiyonu
function removeTag(index) {
    tags.splice(index, 1);
    updateTags(document.getElementById("tag-container"));
}

// API'den isim üretme ve sonuçları ekrana yerleştirme (Benzersiz isimler + Dinamik Font + Rastgele Renk)
async function generateNames() {
    const keywords = JSON.parse(sessionStorage.getItem("keywords")) || null;
    const selectedCategory = sessionStorage.getItem("category") || null; // Hata burada düzeltildi
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
                        const selectedFont = randomFont; // Font bilgisini de al
                        const selectedBgColor = randomColor; // Background rengini al
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

// Kategori seçimi için fonksiyon
function selectCategory(category) {
    sessionStorage.setItem("category", category);
    sessionStorage.removeItem("keywords");
    window.location.href = "results.html";
}

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
    // Header'ı yükle ve ardından butonları aktif et
    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header-placeholder").innerHTML = data;

            // ✅ Mobil menü butonunu aktif et
            const menuButton = document.getElementById("mobile-menu-button");
            const mobileMenu = document.getElementById("mobile-menu");

            if (menuButton && mobileMenu) {
                console.log("✅ Mobil menü butonu bulundu!"); 
                menuButton.addEventListener("click", function () {
                    console.log("🎯 Mobil menüye tıklandı!"); 
                    mobileMenu.classList.toggle("hidden");
                });
            } else {
                console.error("❌ Mobil menü veya buton bulunamadı!");
            }

            // ✅ Dil değiştirici butonlarını aktif et
            const langSwitcher = document.getElementById("lang-switcher");
            const mobileLangSwitcher = document.getElementById("mobile-lang-switcher");

            if (langSwitcher) {
                console.log("✅ Masaüstü dil değiştirici bulundu!");
                langSwitcher.addEventListener("click", () => {
                    console.log("🌐 Masaüstü dil değiştirici tıklandı!");
                });
            } else {
                console.error("❌ Masaüstü dil değiştirici bulunamadı!");
            }

            if (mobileLangSwitcher) {
                console.log("✅ Mobil dil değiştirici bulundu!");
                mobileLangSwitcher.addEventListener("click", () => {
                    console.log("🌐 Mobil dil değiştirici tıklandı!");
                });
            } else {
                console.error("❌ Mobil dil değiştirici bulunamadı!");
            }
        })
        .catch(error => console.error("❌ Header yüklenirken hata oluştu:", error));

    // Footer'ı yükle
    fetch("footer.html")
        .then(response => response.text())
        .then(data => document.getElementById("footer-placeholder").innerHTML = data);
});
// Desteklenen diller
const supportedLanguages = ['en', 'tr'];
let currentLanguage = localStorage.getItem('language') || 'en';

// Dil dosyalarını yükleme fonksiyonu
async function loadLanguage(lang) {
    if (!supportedLanguages.includes(lang)) lang = 'en';

    try {
        const response = await fetch(`/locales/${lang}.json`);
        
        // ✅ Fetch isteğini kontrol edelim
        if (!response.ok) {
            console.error(`❌ Dil dosyası yüklenemedi: ${response.statusText}`);
            return;
        }

        const translations = await response.json();
        console.log(`✅ ${lang} dil dosyası yüklendi:`, translations);

        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[key]) {
                element.textContent = translations[key];
                console.log(`✅ ${key} -> ${translations[key]}`);
            } else {
                console.warn(`⚠️ Çeviri anahtarı bulunamadı: ${key}`);
            }
        });

        // Dil değiştirici butonunu güncelle
        document.getElementById('lang-switcher').textContent = lang.toUpperCase();
        document.getElementById('mobile-lang-switcher').textContent = lang.toUpperCase();

        localStorage.setItem('language', lang);

    } catch (error) {
        console.error('❌ Dil dosyası yükleme hatası:', error);
    }
}

// Dil değiştirici butonlarına tıklama olayları
if (langSwitcher) {
    langSwitcher.addEventListener("click", () => {
        console.log("🌐 Masaüstü dil değiştirici tıklandı!");
        currentLanguage = currentLanguage === 'en' ? 'tr' : 'en';
        loadLanguage(currentLanguage);
    });
}

if (mobileLangSwitcher) {
    mobileLangSwitcher.addEventListener("click", () => {
        console.log("🌐 Mobil dil değiştirici tıklandı!");
        currentLanguage = currentLanguage === 'en' ? 'tr' : 'en';
        loadLanguage(currentLanguage);
    });
}

// Sayfa yüklendiğinde mevcut dili yükle
loadLanguage(currentLanguage);
