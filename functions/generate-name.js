const fetch = require("node-fetch");
const { verifyUser } = require("./firebase-auth"); // Firebase Kimlik Doğrulama

const rateLimit = {}; // Kullanıcı limitlerini takip etmek için obje
const DAILY_LIMIT_FREE = 10;
const DAILY_LIMIT_GOOGLE = 20;
const PREMIUM_LIMIT = Infinity;

exports.handler = async function(event) {
    try {
        const { keywords, idToken } = JSON.parse(event.body);
        
        if (!keywords || keywords.trim() === '') {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Lütfen en az bir anahtar kelime girin." })
            };
        }

        // Kullanıcı kimlik doğrulaması
        const userUID = await verifyUser(idToken);
        if (!userUID) {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: "Yetkilendirme başarısız! Lütfen tekrar giriş yapın." })
            };
        }

        // Kullanıcının arama sınırını belirleme
        const userType = userUID.startsWith("anon_") ? "guest" : "google";
        const userLimit = userType === "google" ? DAILY_LIMIT_GOOGLE : DAILY_LIMIT_FREE;

        // Rate Limiting kontrolü
        if (!rateLimit[userUID]) {
            rateLimit[userUID] = { count: 0, resetTime: Date.now() + 24 * 60 * 60 * 1000 };
        }
        if (rateLimit[userUID].count >= userLimit) {
            return {
                statusCode: 429,
                body: JSON.stringify({ error: "Günlük limitinize ulaştınız!" })
            };
        }

        // OpenAI API çağrısı
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are a branding expert generating ONLY unique business names." },
                    { role: "user", content: `Generate 5 unique business name ideas based on these keywords: ${keywords}.` }
                ],
                max_tokens: 100,
                temperature: 1.0
            })
        });

        const data = await response.json();
        
        if (!data.choices || !data.choices[0]?.message?.content) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "OpenAI yanıtı beklenen formatta değil!" })
            };
        }

        // Tekrar eden isimleri filtreleme
        const names = data.choices[0].message.content
            .split("\n")
            .map(name => name.replace(/^\d+\.\s*/g, "").trim())
            .filter(name => name.length > 0);

        rateLimit[userUID].count++;

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
