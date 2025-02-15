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

// Etiket Sistemi
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
            tag.className = "bg-blue-500 text-white px-3 py-1 rounded-full m-1 flex items-center";
            tag.innerHTML = `${keyword} <button class='ml-2 text-white' onclick='removeTag("${keyword}")'>×</button>`;
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
        newTag.className = "bg-blue-500 text-white px-3 py-1 rounded-full m-1 flex items-center";
        newTag.innerHTML = `${tag} <button class='ml-2 text-white' onclick='removeTag("${tag}")'>×</button>`;
        document.getElementById("tag-container").insertBefore(newTag, document.getElementById("keywords-input"));
    });
}

// Hızlı kategori seçimi ve yönlendirme
function selectCategory(category) {
    sessionStorage.setItem("category", category);
    sessionStorage.removeItem("keywords");
    window.location.href = "results.html";
}

// Generate Name butonu için yönlendirme
function redirectToResults() {
    if (tags.length < 3 || tags.length > 5) {
        document.getElementById("error-message").classList.remove("hidden");
        return;
    }
    sessionStorage.setItem("keywords", JSON.stringify(tags));
    sessionStorage.removeItem("category");
    window.location.href = "results.html";
}

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
