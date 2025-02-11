// Ana sayfaya yönlendirme fonksiyonu
function goHome() {
    window.location.href = "index.html";
}

// API'den isim üretme ve sonuçları ekrana yerleştirme (8 saniye gecikmeli + loading animasyonu)
async function generateNames() {
    const keywords = sessionStorage.getItem("keywords") || "Startup";
    const resultsContainer = document.getElementById("results-container");
    const titleText = document.getElementById("results-title");

    // 🔄 Loading Animasyonu Ekle
    resultsContainer.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
        </div>
    `;

    setTimeout(async () => {
        try {
            const response = await fetch("/.netlify/functions/generate-name", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ keywords })
            });

            const data = await response.json();
            resultsContainer.innerHTML = ""; // Önceki içeriği temizle

            if (data.names && data.names.length > 0) {
                // Başlık güncelleme
                titleText.innerHTML = `Generated names for "<b>${keywords}</b>":`;

                data.names.slice(0, 4).forEach((name, index) => {
                    const card = document.createElement("div");
                    card.className = "card";
                    card.innerText = name;
                    resultsContainer.appendChild(card);

                    // 8 saniye sonra fade efekti ile kartları göster
                    setTimeout(() => {
                        card.classList.add("show");
                    }, 500 + index * 500); // Her kartın gecikmeli görünmesi için ek süre ekledik
                });
            } else {
                resultsContainer.innerHTML = "<p class='text-red-500'>Error generating names. Try again.</p>";
            }
        } catch (error) {
            console.error("API request error:", error);
        }
    }, 8000); // ⏳ 8 saniye bekletme süresi
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
