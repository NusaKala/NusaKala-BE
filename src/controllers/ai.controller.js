const { askGemini } = require("../services/ai.service");

async function handleAsk(req, res) {
    const { prompt } = req.body;
    try {
        const result = await askGemini(prompt);
        res.json({ result });
    } catch (error) {
        console.error("Gemini error:", error.message);
        res.status(500).json({ error: error.message });
    }
}

module.exports = { handleAsk };
