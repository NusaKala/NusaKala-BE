const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const aiRoutes = require('./ai.routes');
const perspectiveRoutes = require('./perspective.routes');
const eventValidationRoutes = require('./event-validation.routes');
const eventRoutes = require('./event.routes');
const predictRoutes = require('./predict.routes');

router.use('/auth', authRoutes);
router.use('/ai', aiRoutes);
router.use('/perspective', perspectiveRoutes);
router.use('/event-validation', eventValidationRoutes);
router.use('/events', eventRoutes);
router.use('/predict', predictRoutes);

module.exports = router;
