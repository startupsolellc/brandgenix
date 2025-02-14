const fetch = require("node-fetch");

exports.handler = async function(event) {
    try {
        const { keywords, category } = JSON.parse(event.body);
        
        if (!keywords && !category) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Lütfen en az üç anahtar kelime girin veya bir kategori seçin." })
            };
        }

        const promptContent = category 
            ? `Generate 5 unique business name ideas for a ${category} business. Only return names, no descriptions.`
            : `Generate 5 unique business name ideas based on the following keywords: ${keywords.join(", ")}. Only return names, no descriptions.`;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are a helpful assistant that generates ONLY business name ideas. Do not provide explanations, descriptions, or numbers. Only return a list of 5 business names, separated by line breaks." },
                    { role: "user", content: promptContent }
                ],
                max_tokens: 100,
                temperature: 0.7
            })
        });

        const data = await response.json();
        console.log("📌 OpenAI API Yanıtı:", JSON.stringify(data, null, 2)); // Yanıtı konsola yazdır

        if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "OpenAI yanıtı beklenen formatta değil!" })
            };
        }

        // Sadece isimleri almak için filtreleme
        const names = data.choices[0].message.content
            .split("\n") // Satırlara böl
            .map(name => name.replace(/^\d+\.\s*/g, "").trim()) // Numaralandırmayı temizle
            .filter(name => name.length > 0); // Boş satırları kaldır

        return {
            statusCode: 200,
            body: JSON.stringify({ names })
        };

    } catch (error) {
        console.error("❌ Error generating name:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Server error. Check Netlify logs for details." })
        };
    }
};
