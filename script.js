// Ana sayfaya yönlendirme fonksiyonu 
function goHome() {
    window.location.href = "index.html";
}

// Önceden üretilen isimleri saklamak için değişken
let previousNames = new Set();
const netlifyFontsApiUrl = "/.netlify/functions/get-fonts"; // Netlify Functions API

// Etiketler için boş bir dizi oluştur
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

// API'den isim üretme ve sonuçları ekrana yerleştirme (Benzersiz isimler + Dinamik Font)
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
                        window.location.href = `/customize?name=${encodeURIComponent(selectedName)}`;
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

function handleKeyDown(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        const input = document.getElementById("keywords-input");
        const tagContainer = document.getElementById("tag-container");
        const errorMessage = document.getElementById("error-message");

        let keyword = input.value.trim();

        if (keyword !== "" && !tags.includes(keyword) && tags.length < 5) {
            tags.push(keyword);
            updateTagUI();
            input.value = "";
        }

        validateTags(); // Minimum 3 etiket kontrolü
    }
}

function removeTag(keyword) {
    tags = tags.filter(tag => tag !== keyword);
    updateTagUI();
    validateTags();
}

function updateTagUI() {
    const tagContainer = document.getElementById("tag-container");
    tagContainer.innerHTML = '<input type="text" id="keywords-input" placeholder="Enter keywords..." class="flex-1 bg-transparent text-gray-700 text-lg border-none focus:outline-none px-4" onkeydown="handleKeyDown(event)">';
    
    tags.forEach(tag => {
        const tagElement = document.createElement("span");
        tagElement.className = "bg-blue-500 text-white px-3 py-1 rounded-full text-sm mr-2 mb-2";
        tagElement.innerHTML = `${tag} <button onclick="removeTag('${tag}')" class="ml-1 text-white">&times;</button>`;
        tagContainer.insertBefore(tagElement, document.getElementById("keywords-input"));
    });
}

function validateTags() {
    const errorMessage = document.getElementById("error-message");
    const generateButton = document.querySelector("button[onclick='redirectToResults()']");
    
    if (tags.length < 3 || tags.length > 5) {
        errorMessage.classList.remove("hidden");
        generateButton.disabled = true;
    } else {
        errorMessage.classList.add("hidden");
        generateButton.disabled = false;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    validateTags();
});
