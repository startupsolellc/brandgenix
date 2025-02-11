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

        return {
            statusCode: 200,
            body: JSON.stringify({ names: data.choices[0].text.trim().split("\n") })
        };

    } catch (error) {
        console.error("❌ Error generating name:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Bir hata oluştu, lütfen tekrar deneyin." })
        };
    }
};
