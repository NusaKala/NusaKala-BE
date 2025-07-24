const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const routes = require('./routes/index');
const database = require('../config/database');

const app = express();

// Initialize database connection
database.connect().catch(err => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
});

app.use(morgan('dev'));
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use('/api', routes);

module.exports = app;
