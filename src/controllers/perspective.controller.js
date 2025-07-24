const perspectiveService = require('../services/perspective.service');

exports.analyzeText = async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    try {
        const analysis = await perspectiveService.analyzeText(text);
        res.json(analysis);
    } catch (error) {
        console.error('Error analyzing comment:', error);
        res.status(500).json({ error: 'Failed to analyze comment' });
    }
};
