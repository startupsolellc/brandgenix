const fetch = require("node-fetch");

exports.handler = async function(event) {
    try {
        const { keywords } = JSON.parse(event.body);
        
        if (!keywords || !Array.isArray(keywords) || keywords.length < 3) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Please provide at least 3 keywords." })
            };
        }

        // OpenAI API çağrısını optimize etmek için prompt'u güçlendirme
        const prompt = `Generate 5 unique and brandable business names by creatively combining the following keywords: ${keywords.join(", ")}. Avoid using the same structure repeatedly. Use abbreviations, synonyms, and mix words in different ways. Only return business names, separated by line breaks.`;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are a business name generator. Provide only unique and creative business names. Do not include explanations, numbers, or lists." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 100,
                temperature: 1.0, // Daha yaratıcı isimler için artırıldı
                top_p: 0.9, // Çıktı çeşitliliğini artırır
                frequency_penalty: 0.5, // Tekrar eden kelimeleri azaltır
                presence_penalty: 0.6 // Daha çeşitli isimler üretmeye teşvik eder
            })
        });

        const data = await response.json();
        console.log("📌 OpenAI API Yanıtı:", JSON.stringify(data, null, 2));

        if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Unexpected response from OpenAI." })
            };
        }

        // Sadece isimleri almak için filtreleme
        const names = data.choices[0].message.content
            .split("\n")
            .map(name => name.replace(/^[0-9]+\.\s*/g, "").trim())
            .filter(name => name.length > 0);

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
