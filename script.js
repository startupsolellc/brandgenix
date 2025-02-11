// Ana sayfaya yönlendirme fonksiyonu
function goHome() {
    window.location.href = "index.html";
}

// API'den isim üretme ve sonuçları ekrana yerleştirme
async function generateNames() {
    const keywords = sessionStorage.getItem("keywords") || "Startup";
    const resultsContainer = document.getElementById("results-container");
    const titleText = document.getElementById("results-title");

    try {
        const response = await fetch("/.netlify/functions/generate-name", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keywords })
        });

        const data = await response.json();
        resultsContainer.innerHTML = ""; // Önceki kartları temizle

        if (data.names && data.names.length > 0) {
            // Başlık güncelleme
            titleText.innerHTML = `Here are five unique business name ideas inspired by the keywords "<b>${keywords}</b>":`;

            data.names.forEach(name => {
                // Önceki numaralandırmayı temizleme
                const cleanName = name.replace(/^\d+\.\s\*\*/g, "").replace(/\*\*/g, "");
                
                const card = document.createElement("div");
                card.className = "card";
                card.innerText = cleanName;
                resultsContainer.appendChild(card);
            });
        } else {
            resultsContainer.innerHTML = "<p class='text-red-500'>Error generating names. Try again.</p>";
        }
    } catch (error) {
        console.error("API request error:", error);
    }
}

// Ana sayfada anahtar kelimeyi al ve yönlendir
document.getElementById("generate-button")?.addEventListener("click", function() {
    const keywords = document.getElementById("keywords").value.trim();
    if (keywords) {
        sessionStorage.setItem("keywords", keywords);
        window.location.href = "results.html";
    } else {
        alert("Please enter a keyword!");
    }
});

// Sayfa yüklendiğinde otomatik isim üret
if (window.location.pathname.includes("results.html")) {
    window.onload = generateNames;
}
