const API_KEY = "YOUR_OPENAI_API_KEY"; // OpenAI API Key burada olmalı

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
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4o",
            messages: [{ role: "user", content: `Generate 6 unique business name ideas based on: ${keywords}` }],
            max_tokens: 50,
            temperature: 0.7
        })
    });

    const data = await response.json();
    const resultsContainer = document.getElementById("results-container");

    if (data.choices && data.choices.length > 0) {
        resultsContainer.innerHTML = ""; // Önceki kartları temizle
        const names = data.choices[0].message.content.split("\n").filter(name => name.trim() !== "");
        
        names.forEach(name => {
            const card = document.createElement("div");
            card.className = "p-6 bg-white rounded-lg shadow-md text-center text-lg font-semibold";
            card.innerText = name;
            resultsContainer.appendChild(card);
        });
    } else {
        console.error("API request failed", data);
    }
}

// Sayfa yüklendiğinde ilk isimleri üret
window.onload = generateNames;
