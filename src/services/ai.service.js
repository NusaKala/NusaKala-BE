const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

async function askGemini(prompt) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return (
        response.candidates[0].content.parts[0].text ||
        ""
    );
}

module.exports = { askGemini };
