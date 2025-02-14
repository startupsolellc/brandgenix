// Ana sayfaya yönlendirme fonksiyonu
function goHome() {
    window.location.href = "index.html";
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
    const keywords = JSON.parse(sessionStorage.getItem("keywords")) || ["Startup"];
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
                titleText.innerHTML = `Generated names for "<b>${keywords.join(", ")}</b>":`;

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

// Etiket (Tag) Sistemini Ana Sayfada Yönetme
let tags = [];
function handleKeyDown(event) {
    const input = document.getElementById("keywords-input");
    const tagContainer = document.getElementById("tag-container");
    const errorMessage = document.getElementById("error-message");

    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const keyword = input.value.trim();

        if (keyword && !tags.includes(keyword) && tags.length < 5) {
            tags.push(keyword);
            const tag = document.createElement("span");
            tag.className = "tag";
            tag.innerHTML = `${keyword} <button onclick='removeTag("${keyword}")'>×</button>`;
            tagContainer.insertBefore(tag, input);
            input.value = "";
        }

        if (tags.length >= 3) {
            errorMessage.classList.add("hidden");
        }
    }
}

function removeTag(keyword) {
    tags = tags.filter(tag => tag !== keyword);
    document.getElementById("tag-container").innerHTML = '<input type="text" id="keywords-input" placeholder="Enter keywords..." class="flex-1 bg-transparent text-gray-700 text-lg border-none focus:outline-none px-4" onkeydown="handleKeyDown(event)">';
    tags.forEach(tag => {
        const newTag = document.createElement("span");
        newTag.className = "tag";
        newTag.innerHTML = `${tag} <button onclick='removeTag("${tag}")'>×</button>`;
        document.getElementById("tag-container").insertBefore(newTag, document.getElementById("keywords-input"));
    });
}

function redirectToResults() {
    if (tags.length < 3 || tags.length > 5) {
        document.getElementById("error-message").classList.remove("hidden");
        return;
    }
    sessionStorage.setItem("keywords", JSON.stringify(tags));
    window.location.href = "results.html";
}

if (window.location.pathname.includes("results.html")) {
    window.onload = generateNames;
}
