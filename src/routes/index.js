const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const aiRoutes = require('./ai.routes');
const perspectiveRoutes = require('./perspective.routes');

router.use('/auth', authRoutes);
router.use('/ai', aiRoutes);
router.use('/perspective', perspectiveRoutes);

module.exports = router;
