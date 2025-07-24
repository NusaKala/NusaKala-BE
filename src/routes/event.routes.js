const express = require('express')
const router = express.Router()
const eventController = require('../controllers/event.controller')
const authMiddleware = require('../middlewares/auth.middleware')

// Public routes (no authentication required)
router.get('/', eventController.getAllEvents)
router.get('/stats', eventController.getEventStats)
router.get('/:eventId', eventController.getEventById)

// Protected routes (authentication required)
router.use(authMiddleware) // Apply auth middleware to all routes below

router.post('/', eventController.createEvent)
router.put('/:eventId', eventController.updateEvent)
router.delete('/:eventId', eventController.deleteEvent)
router.get('/user/events', eventController.getEventsByUser)

module.exports = router 