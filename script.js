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
        
        // 🟢 Yeni: Etiket eklendikten sonra input otomatik olarak odaklanacak
        setTimeout(() => {
            document.getElementById("keywords-input").focus();
        }, 10);
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

    // 🟢 Yeni: Etiketler güncellendikten sonra input tekrar odaklanacak
    setTimeout(() => {
        input.focus();
    }, 10);
}
