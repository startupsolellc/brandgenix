async function generateName() {
    const keywords = document.getElementById("keywords").value.trim();
    if (!keywords) {
        alert("Please enter some keywords!");
        return;
    }

    const apiKey = "YOUR_OPENAI_API_KEY"; // OpenAI API Anahtarını buraya ekle!
    const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-4o",
            prompt: `Generate 5 unique business name ideas based on the following keywords: ${keywords}`,
            max_tokens: 50,
            temperature: 0.7
        })
    });

    const data = await response.json();
    const results = document.getElementById("results");
    results.innerHTML = "";

    if (data.choices) {
        data.choices[0].text.trim().split("\n").forEach(name => {
            const li = document.createElement("li");
            li.textContent = name;
            results.appendChild(li);
        });
    } else {
        results.innerHTML = "<li>Error generating names. Try again.</li>";
    }
}
