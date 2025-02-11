const fetch = require("node-fetch");

exports.handler = async function(event) {
    try {
        const { keywords } = JSON.parse(event.body);
        
        if (!keywords || keywords.trim() === '') {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Lütfen en az bir anahtar kelime girin." })
            };
        }

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",  // Model doğru
                messages: [
                    { role: "system", content: "You are a helpful assistant that generates unique business name ideas." },
                    { role: "user", content: `Generate 5 unique business name ideas based on the following keywords: ${keywords}` }
                ],
                max_tokens: 50,
                temperature: 0.7
            })
        });

        const data = await response.json();
        console.log("📌 OpenAI API Yanıtı:", JSON.stringify(data, null, 2)); // Yanıtı konsola yazdır

        if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
            throw new Error("OpenAI yanıtı beklenen formatta değil!")
