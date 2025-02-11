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

        const response = await fetch("https://api.openai.com/v1/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                prompt: `Generate 5 unique business name ideas based on the following keywords: ${keywords}`,
                max_tokens: 50,
                temperature: 0.7
            })
        });

        const data = await response.json();
        console.log("📌 OpenAI API Yanıtı:", JSON.stringify(data, null, 2)); // API yanıtını logla

        // API'den doğru veri gelip gelmediğini kontrol edelim
        if (!data.choices || !data.choices[0] || !data.choices[0].text) {
            throw new Error("OpenAI yanıtı beklenen formatta değil!");
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ names: data.choices[0].text.trim().split("\n") })
        };

    } catch (error) {
        console.error("❌ Error generating name:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Server error. Check Netlify logs for details." })
        };
    }
};
