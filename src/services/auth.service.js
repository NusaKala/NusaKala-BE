const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const database = require('../../config/database');

const generateTokens = (userId, email, role) => {
    const accessToken = jwt.sign(
        { userId, email, role },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );
    
    const refreshToken = jwt.sign(
        { userId, email, role },
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
    
    return { accessToken, refreshToken };
};

exports.register = async (email, password, role = 'tourist') => {
    try {
        // Check if user already exists
        const existingUser = await database.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );
        
        if (existingUser.rows.length > 0) {
            throw new Error('User already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);
        
        // Create user
        const result = await database.query(
            `INSERT INTO users (id, email, password, role) 
             VALUES ($1, $2, $3, $4) 
             RETURNING id, email, role, created_at`,
            [uuidv4(), email, hashedPassword, role]
        );
        
        const user = result.rows[0];
        const tokens = generateTokens(user.id, user.email, user.role);
        
        logger.info(`User registered: ${email}`);
        
        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                created_at: user.created_at
            },
            ...tokens
        };
    } catch (error) {
        logger.error('Registration error:', error);
        throw error;
    }
};

exports.login = async (email, password) => {
    try {
        // Find user
        const result = await database.query(
            'SELECT id, email, password, role FROM users WHERE email = $1',
            [email]
        );
        
        if (result.rows.length === 0) {
            throw new Error('User not found');
        }
        
        const user = result.rows[0];
        
        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid password');
        }
        
        // Generate tokens
        const tokens = generateTokens(user.id, user.email, user.role);
        
        logger.info(`User logged in: ${email}`);
        
        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            },
            ...tokens
        };
    } catch (error) {
        logger.error('Login error:', error);
        throw error;
    }
};

exports.refreshToken = async (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
        
        // Get user from database
        const result = await database.query(
            'SELECT id, email, role FROM users WHERE id = $1',
            [decoded.userId]
        );
        
        if (result.rows.length === 0) {
            throw new Error('User not found');
        }
        
        const user = result.rows[0];
        const tokens = generateTokens(user.id, user.email, user.role);
        
        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            },
            ...tokens
        };
    } catch (error) {
        logger.error('Token refresh error:', error);
        throw new Error('Invalid refresh token');
    }
};

exports.logout = async (userId) => {
    try {
        // In a more advanced implementation, you might want to blacklist the refresh token
        // For now, we'll just log the logout
        logger.info(`User logged out: ${userId}`);
        return { message: 'Logged out successfully' };
    } catch (error) {
        logger.error('Logout error:', error);
        throw error;
    }
};
