// Ana sayfaya yönlendirme
function goHome() {
    window.location.href = "index.html";
}

// API'den yeni isimler almak ve sonuçları karta yerleştirmek
async function generateNames() {
    const keywords = sessionStorage.getItem("keywords") || "Startup";
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}` // Buraya API Key'inizi ekleyin
        },
        body: JSON.stringify({
            model: "gpt-4o",
            messages: [{ role: "user", content: `Generate 6 unique business name ideas based on: ${keywords}` }],
            max_tokens: 50,
            temperature: 0.7
        })
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
        const names = data.choices[0].message.content.split("\n").filter(name => name.trim() !== "");
        const cards = document.querySelectorAll(".card");

        cards.forEach((card, index) => {
            if (names[index]) {
                card.innerHTML = `<div class="p-6 bg-white rounded-lg shadow-md text-center text-lg font-semibold">${names[index]}</div>`;
            }
        });
    } else {
        console.error("API request failed", data);
    }
}

// "Create More" butonuna tıklayınca yeni isimler üret
function generateMore() {
    generateNames();
}

// Sayfa yüklendiğinde ilk isimleri üret
window.onload = generateNames;
