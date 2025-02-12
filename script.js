// Ana sayfaya yönlendirme fonksiyonu
function goHome() {
    window.location.href = "index.html";
}

// Önceden üretilen isimleri saklamak için değişken
let previousNames = new Set();
const netlifyFontsApiUrl = "/.netlify/functions/get-fonts"; // Netlify Functions API

// Kullanıcı kelimelerini saklama
let tags = [];
const inputField = document.getElementById("keyword-input");
const tagContainer = document.getElementById("tag-container");
const generateButton = document.querySelector("button");

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

// Kullanıcıdan kelime ekleme
function handleKeyPress(event) {
    if (event.key === 'Enter' || event.type === 'blur') {
        event.preventDefault();
        addTag();
    }
}

function addTag() {
    let keyword = inputField.value.trim();
    if (keyword !== "" && !tags.includes(keyword) && tags.length < 5) {
        tags.push(keyword);
        updateTagDisplay();
        inputField.value = "";
    } else if (tags.length >= 5) {
        alert("You can add a maximum of 5 keywords.");
    }
    checkButtonState();
}

function removeTag(tag) {
    tags = tags.filter(t => t !== tag);
    updateTagDisplay();
    checkButtonState();
}

function updateTagDisplay() {
    tagContainer.innerHTML = "";
    tags.forEach(tag => {
        const tagElement = document.createElement("div");
        tagElement.className = "tag";
        tagElement.innerHTML = `${tag} <span class='remove' onclick='removeTag("${tag}")'>&times;</span>`;
        tagContainer.appendChild(tagElement);
    });
}

// Buton aktif/pasif durumu
function checkButtonState() {
    generateButton.disabled = tags.length < 3;
}

// Sayfa yüklendiğinde butonun durumu kontrol edilsin
checkButtonState();

// API'den isim üretme ve sonuçları ekrana yerleştirme (Benzersiz isimler + Dinamik Font)
async function generateNames() {
    const storedKeywords = sessionStorage.getItem("keywords");
    let keywords = [];
    
    if (storedKeywords) {
        try {
            keywords = JSON.parse(storedKeywords);
        } catch (error) {
            console.error("❌ Hata: sessionStorage içinde yanlış formatta veri var!", error);
        }
    }

    if (!Array.isArray(keywords) || keywords.length < 3) {
        alert("Please enter at least 3 keywords!");
        return;
    }

    sessionStorage.setItem("keywords", JSON.stringify(keywords));
    window.location.href = "results.html";
}

// Sayfa yüklendiğinde otomatik isim üret
if (window.location.pathname.includes("results.html")) {
    window.onload = generateNames;
}
