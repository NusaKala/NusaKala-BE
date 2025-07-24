const authService = require('../services/auth.service');

exports.register = async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await authService.register(username, password);
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const token = await authService.login(username, password);
        res.status(200).json({ token });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
};
