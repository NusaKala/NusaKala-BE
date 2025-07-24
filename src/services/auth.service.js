const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const users = [];

exports.register = async (username, password) => {
    const existing = users.find(u => u.username === username);
    if (existing) throw new Error('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    return { message: 'User registered' };
};

exports.login = async (username, password) => {
    const user = users.find(u => u.username === username);
    if (!user) throw new Error('User not found');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Invalid password');

    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });

    return token;
};
