const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const routes = require('./routes/index');
const database = require('../config/database');
const path = require('path')

const app = express();

// Initialize database connection
database.connect().catch(err => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
});

app.use(morgan('dev'));
app.use(cors({
    origin: [
        process.env.CORS_ORIGIN,
        'http://localhost:3000',
        'https://nusa-kala-fe-yuae-q4hhwyz34-nanthedoms-projects.vercel.app',
        'https://nusa-kala-fe-yuae.vercel.app'
    ],
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use('/api', routes);
app.use('/model', express.static(path.join(__dirname, '..', 'public/model')));

module.exports = app;
