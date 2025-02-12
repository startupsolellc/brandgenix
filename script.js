// Güncellenmiş script.js

// Ana sayfaya yönlendirme fonksiyonu
function goHome() {
    window.location.href = "index.html";
}

// Etiket Sistemi için Değişkenler
let tags = [];
const tagContainer = document.getElementById("tag-container");
const tagInput = document.getElementById("tag-input");

// Etiket Ekleme Fonksiyonu
function addTag(tag) {
    if (tags.length >= 5) return;
    if (!tags.includes(tag)) {
        tags.push(tag);
        updateTags();
    }
}

tagInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter" && tagInput.value.trim() !== "") {
        addTag(tagInput.value.trim());
        tagInput.value = "";
    }
});

// Etiketleri Güncelleme
function updateTags() {
    tagContainer.innerHTML = "";
    tags.forEach(tag => {
        const tagElement = document.createElement("div");
        tagElement.className = "tag";
        tagElement.innerText = tag;

        const removeButton = document.createElement("span");
        removeButton.innerText = " ×";
        removeButton.className = "remove-tag";
        removeButton.onclick = () => removeTag(tag);
        
        tagElement.appendChild(removeButton);
        tagContainer.appendChild(tagElement);
    });
}

// Etiket Silme Fonksiyonu
function removeTag(tag) {
    tags = tags.filter(t => t !== tag);
    updateTags();
}

// Sonuç Sayfasına Yönlendirme
function redirectToResults() {
    if (tags.length < 3) {
        alert("Please enter at least 3 keywords!");
        return;
    }
    sessionStorage.setItem("keywords", tags.join(","));
    window.location.href = "results.html";
}

// Önceden üretilen isimleri saklamak için değişken
let previousNames = new Set();
const netlifyFontsApiUrl = "/.netlify/functions/get-fonts"; // Netlify Functions API

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

// API'den isim üretme ve sonuçları ekrana yerleştirme (Benzersiz isimler + Dinamik Font)
async function generateNames() {
    const keywords = sessionStorage.getItem("keywords") || "Startup";
    const resultsContainer = document.getElementById("results-container");
    const titleText = document.getElementById("results-title");

    // 🔄 Loading Animasyonu Ekle (Tam Ortada)
    const loadingDiv = document.createElement("div");
    loadingDiv.className = "loading-container";
    loadingDiv.innerHTML = `<div class="spinner"></div>`;
    document.body.appendChild(loadingDiv);

    setTimeout(async () => {
        try {
            let uniqueNames = [];
            let attempts = 0;
            const maxAttempts = 5;

            while (uniqueNames.length < 4 && attempts < maxAttempts) {
                const response = await fetch("/.netlify/functions/generate-name", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ keywords })
                });

                const data = await response.json();

                if (data.names && data.names.length > 0) {
                    const newNames = data.names.filter(name => !previousNames.has(name));
                    uniqueNames.push(...newNames);
                    uniqueNames = [...new Set(uniqueNames)];
                }
                attempts++;
            }

            document.body.removeChild(loadingDiv);

            if (uniqueNames.length > 0) {
                resultsContainer.innerHTML = "";
                titleText.innerHTML = `Generated names for "<b>${keywords}</b>":`;

                uniqueNames.slice(0, 4).forEach(async (name, index) => {
                    previousNames.add(name);
                    const card = document.createElement("div");
                    const randomFont = await getRandomFont();
                    const link = document.createElement("link");
                    link.href = `https://fonts.googleapis.com/css2?family=${randomFont.replace(/ /g, '+')}&display=swap`;
                    link.rel = "stylesheet";
                    document.head.appendChild(link);
                    card.style.fontFamily = `"${randomFont}", sans-serif`;
                    card.className = "card";
                    card.innerText = name;
                    resultsContainer.appendChild(card);
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

// Sayfa yüklendiğinde otomatik isim üret
if (window.location.pathname.includes("results.html")) {
    window.onload = generateNames;
}
