const authService = require('../services/auth.service');
const logger = require('../utils/logger');
const { validateRegistration, validateLogin } = require('../utils/validation');

exports.register = async (req, res) => {
    const { email, password, role } = req.body;
    
    try {
        // Validate input
        const validation = validateRegistration(email, password, role);
        if (!validation.isValid) {
            return res.status(400).json({ 
                error: 'Validation failed',
                details: validation.errors
            });
        }
        
        const result = await authService.register(email, password, role);
        
        // Set cookies
        res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });
        
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        
        res.status(201).json({
            message: 'User registered successfully',
            user: result.user
        });
    } catch (err) {
        logger.error('Registration controller error:', err);
        res.status(400).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Validate input
        const validation = validateLogin(email, password);
        if (!validation.isValid) {
            return res.status(400).json({ 
                error: 'Validation failed',
                details: validation.errors
            });
        }
        
        const result = await authService.login(email, password);
        
        // Set cookies
        res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });
        
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        
        res.status(200).json({
            message: 'Login successful',
            user: result.user
        });
    } catch (err) {
        logger.error('Login controller error:', err);
        res.status(401).json({ error: err.message });
    }
};

exports.refresh = async (req, res) => {
    const { refreshToken } = req.cookies;
    
    try {
        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token required' });
        }
        
        const result = await authService.refreshToken(refreshToken);
        
        // Set new cookies
        res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });
        
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        
        res.status(200).json({
            message: 'Token refreshed successfully',
            user: result.user
        });
    } catch (err) {
        logger.error('Token refresh controller error:', err);
        res.status(401).json({ error: err.message });
    }
};

exports.logout = async (req, res) => {
    try {
        await authService.logout(req.user?.userId);
        
        // Clear cookies
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        logger.error('Logout controller error:', err);
        res.status(500).json({ error: 'Logout failed' });
    }
};

exports.me = async (req, res) => {
    try {
        res.status(200).json({
            user: {
                id: req.user.userId,
                email: req.user.email,
                role: req.user.role
            }
        });
    } catch (err) {
        logger.error('Me controller error:', err);
        res.status(500).json({ error: 'Failed to get user info' });
    }
};
