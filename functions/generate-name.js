const fetch = require("node-fetch");

exports.handler = async function(event) {
    try {
        const { keywords } = JSON.parse(event.body);
        
        if (!keywords || keywords.length < 3 || keywords.length > 5) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Lütfen en az 3, en fazla 5 anahtar kelime girin." })
            };
        }

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are a helpful assistant that generates ONLY business name ideas. Do not provide explanations, descriptions, or numbers. Only return a list of 5 unique business names, separated by line breaks." },
                    { role: "user", content: `Generate 5 highly creative and brandable business name ideas based on the keywords: ${keywords.join(", ")}. Do NOT return generic names.` }
                ],
                max_tokens: 150,
                temperature: 1.0
            })
        });

        const data = await response.json();

        if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "OpenAI yanıtı beklenen formatta değil!" })
            };
        }

        const names = data.choices[0].message.content
            .split("\n")
            .map(name => name.replace(/^\d+\.\s*/g, "").trim())
            .filter(name => name.length > 0);

        return {
            statusCode: 200,
            body: JSON.stringify({ names })
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Server error. Check Netlify logs for details." })
        };
    }
};
