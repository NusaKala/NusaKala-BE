require('dotenv').config({ path: '.env', quiet: 'true' });

const logger = require('./src/utils/logger');
const app = require('./src/app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
});
