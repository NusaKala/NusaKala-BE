const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

module.exports = (req, res, next) => {
    try {
        // Check for access token in cookies first
        const accessToken = req.cookies.accessToken;
        
        if (!accessToken) {
            return res.status(401).json({ 
                error: 'Access token required',
                code: 'TOKEN_MISSING'
            });
        }

        // Verify access token
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        logger.error('JWT verification error:', err);
        
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                error: 'Access token expired',
                code: 'TOKEN_EXPIRED'
            });
        }
        
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                error: 'Invalid access token',
                code: 'TOKEN_INVALID'
            });
        }
        
        res.status(401).json({ 
            error: 'Authentication failed',
            code: 'AUTH_FAILED'
        });
    }
};

// Optional middleware for routes that can work with or without authentication
module.exports.optional = (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        
        if (!accessToken) {
            return next(); // Continue without user info
        }

        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        // Continue without user info if token is invalid
        next();
    }
};
