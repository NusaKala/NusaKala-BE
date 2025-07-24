const { Client } = require('pg');
const logger = require('../src/utils/logger');

let client = null;

const getClient = () => {
    if (!client) {
        client = new Client({
            connectionString: process.env.DATABASE_URL,
        });
    }
    return client;
};

const connect = async () => {
    try {
        const dbClient = getClient();
        await dbClient.connect();
        logger.info('Database connected successfully');
    } catch (error) {
        logger.error('Database connection failed:', error);
        throw error;
    }
};

const disconnect = async () => {
    if (client) {
        await client.end();
        client = null;
        logger.info('Database connection closed');
    }
};

const query = async (text, params) => {
    try {
        const dbClient = getClient();
        const result = await dbClient.query(text, params);
        return result;
    } catch (error) {
        logger.error('Database query error:', error);
        throw error;
    }
};

module.exports = {
    connect,
    disconnect,
    query,
    getClient
}; 