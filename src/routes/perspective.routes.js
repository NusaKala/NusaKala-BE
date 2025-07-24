const express = require('express');
const router = express.Router();
const perspectiveController = require('../controllers/perspective.controller');

router.post('/analyze', perspectiveController.analyzeText);

module.exports = router;
