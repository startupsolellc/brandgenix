// Ana sayfaya yönlendirme fonksiyonu
function goHome() {
    window.location.href = "index.html";
}

// Önceden üretilen isimleri saklamak için değişken
let previousNames = new Set();
const netlifyFontsApiUrl = "/.netlify/functions/get-fonts"; // Netlify Functions API

// Etiketleri saklamak için değişken
let tags = [];

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

// API'den isim üretme ve sonuçları ekrana yerleştirme (Benzersiz isimler + Dinamik Font)
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
                    const link = document.createElement("link");
                    link.href = `https://fonts.googleapis.com/css2?family=${randomFont.replace(/ /g, '+')}&display=swap`;
                    link.rel = "stylesheet";
                    document.head.appendChild(link);

                    card.style.fontFamily = `"${randomFont}", sans-serif`;
                    card.className = "card cursor-pointer transition duration-300 hover:shadow-lg";
                    card.innerText = name;
                    resultsContainer.appendChild(card);

                    card.addEventListener("click", function () {
                        const selectedName = this.innerText.trim();
                        const selectedFont = randomFont; // Font bilgisini de al
                        window.location.href = `/customize?name=${encodeURIComponent(selectedName)}&font=${encodeURIComponent(selectedFont)}`;
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

// Header ve Footer'ı yükleme fonksiyonu
document.addEventListener("DOMContentLoaded", function () {
    fetch("header.html")
        .then(response => response.text())
        .then(data => document.getElementById("header-placeholder").innerHTML = data);

    fetch("footer.html")
        .then(response => response.text())
        .then(data => document.getElementById("footer-placeholder").innerHTML = data);
});
