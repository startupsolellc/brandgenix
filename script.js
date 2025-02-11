// Ana sayfaya yönlendirme fonksiyonu
function goHome() {
    window.location.href = "index.html";
}

// API'den isim üretme ve sonuçları sonuç sayfasına yerleştirme
async function generateNames() {
    const keywords = sessionStorage.getItem("keywords") || "Startup";
    const resultsContainer = document.getElementById("results-container");

    try {
        const response = await fetch("/.netlify/functions/generate-name", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keywords })
        });

        const data = await response.json();
        resultsContainer.innerHTML = ""; // Önceki kartları temizle

        if (data.names && data.names.length > 0) {
            data.names.forEach(name => {
                const card = document.createElement("div");
                card.className = "card";
                card.innerText = name;
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
