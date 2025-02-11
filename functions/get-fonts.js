const fetch = require("node-fetch");

exports.handler = async function () {
    try {
        const googleFontsApiKey = process.env.GOOGLE_FONTS_API_KEY; // Netlify Environment Variable
        const googleFontsApiUrl = `https://www.googleapis.com/webfonts/v1/webfonts?key=${googleFontsApiKey}`;

        const response = await fetch(googleFontsApiUrl);
        const data = await response.json();

        if (!data.items) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Failed to fetch fonts from Google API" }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ fonts: data.items.map(font => font.family) }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
