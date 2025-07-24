const express = require('express');
const router = express.Router();
const eventValidationController = require('../controllers/event-validation.controller');

router.post('/validate', eventValidationController.validateEvent);
router.put('/validate/:eventId', eventValidationController.validateEventUpdate);

module.exports = router; 