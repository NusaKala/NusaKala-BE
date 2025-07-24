const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    // At least 6 characters, can include letters, numbers, and special characters
    return password && password.length >= 6;
};

const validateRole = (role) => {
    const validRoles = ['tourist', 'organizer', 'creator'];
    return validRoles.includes(role);
};

const validateRegistration = (email, password, role = 'tourist') => {
    const errors = [];
    
    if (!email) {
        errors.push('Email is required');
    } else if (!validateEmail(email)) {
        errors.push('Invalid email format');
    }
    
    if (!password) {
        errors.push('Password is required');
    } else if (!validatePassword(password)) {
        errors.push('Password must be at least 6 characters long');
    }
    
    if (role && !validateRole(role)) {
        errors.push('Invalid role. Must be one of: tourist, organizer, creator');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

const validateLogin = (email, password) => {
    const errors = [];
    
    if (!email) {
        errors.push('Email is required');
    }
    
    if (!password) {
        errors.push('Password is required');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

module.exports = {
    validateEmail,
    validatePassword,
    validateRole,
    validateRegistration,
    validateLogin
}; 