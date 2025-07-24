const eventService = require('../services/event.service')
const logger = require('../utils/logger')

exports.getAllEvents = async (req, res) => {
    try {
        const filters = {
            status: req.query.status,
            type: req.query.type,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            latitude: req.query.latitude ? parseFloat(req.query.latitude) : null,
            longitude: req.query.longitude ? parseFloat(req.query.longitude) : null,
            radius: req.query.radius ? parseFloat(req.query.radius) : null,
            limit: req.query.limit ? parseInt(req.query.limit) : null,
            offset: req.query.offset ? parseInt(req.query.offset) : null
        }

        logger.info('Getting all events with filters:', filters)

        const result = await eventService.getAllEvents(filters)

        res.status(200).json({
            success: true,
            message: 'Events retrieved successfully',
            data: result
        })

    } catch (error) {
        logger.error('Get all events error:', error)
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

exports.getEventById = async (req, res) => {
    try {
        const { eventId } = req.params

        logger.info('Getting event by ID:', eventId)

        const result = await eventService.getEventById(eventId)

        res.status(200).json({
            success: true,
            message: 'Event retrieved successfully',
            data: result.event
        })

    } catch (error) {
        logger.error('Get event by ID error:', error)
        
        if (error.message === 'Event not found') {
            res.status(404).json({
                success: false,
                error: 'Event not found'
            })
        } else {
            res.status(500).json({
                success: false,
                error: error.message
            })
        }
    }
}

exports.createEvent = async (req, res) => {
    try {
        const eventData = req.body
        const userId = req.user.id

        const requiredFields = ['name', 'description', 'types', 'place_name', 'start_datetime', 'end_datetime']
        const missingFields = requiredFields.filter(field => !eventData[field])

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                error: `Missing required fields: ${missingFields.join(', ')}`
            })
        }

        logger.info('Creating new event:', eventData.name)

        const result = await eventService.createEvent(eventData, userId)

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: {
                event: result.event,
                validation: result.validation
            }
        })

    } catch (error) {
        logger.error('Create event error:', error)
        
        if (error.message.includes('validation failed')) {
            res.status(400).json({
                success: false,
                error: error.message,
                type: 'validation_error'
            })
        } else {
            res.status(500).json({
                success: false,
                error: error.message
            })
        }
    }
}

exports.updateEvent = async (req, res) => {
    try {
        const { eventId } = req.params
        const eventData = req.body
        const userId = req.user.id

        const requiredFields = ['name', 'description', 'types', 'place_name', 'start_datetime', 'end_datetime']
        const missingFields = requiredFields.filter(field => !eventData[field])

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                error: `Missing required fields: ${missingFields.join(', ')}`
            })
        }

        logger.info('Updating event:', eventId)

        const result = await eventService.updateEvent(eventId, eventData, userId)

        res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            data: {
                event: result.event,
                validation: result.validation
            }
        })

    } catch (error) {
        logger.error('Update event error:', error)
        
        if (error.message === 'Event not found') {
            res.status(404).json({
                success: false,
                error: 'Event not found'
            })
        } else if (error.message.includes('Unauthorized')) {
            res.status(403).json({
                success: false,
                error: error.message
            })
        } else if (error.message.includes('validation failed')) {
            res.status(400).json({
                success: false,
                error: error.message,
                type: 'validation_error'
            })
        } else {
            res.status(500).json({
                success: false,
                error: error.message
            })
        }
    }
}

exports.deleteEvent = async (req, res) => {
    try {
        const { eventId } = req.params
        const userId = req.user.id

        logger.info('Deleting event:', eventId)

        const result = await eventService.deleteEvent(eventId, userId)

        res.status(200).json({
            success: true,
            message: result.message
        })

    } catch (error) {
        logger.error('Delete event error:', error)
        
        if (error.message === 'Event not found') {
            res.status(404).json({
                success: false,
                error: 'Event not found'
            })
        } else if (error.message.includes('Unauthorized')) {
            res.status(403).json({
                success: false,
                error: error.message
            })
        } else {
            res.status(500).json({
                success: false,
                error: error.message
            })
        }
    }
}

exports.getEventsByUser = async (req, res) => {
    try {
        const userId = req.user.id
        const filters = {
            status: req.query.status,
            limit: req.query.limit ? parseInt(req.query.limit) : null,
            offset: req.query.offset ? parseInt(req.query.offset) : null
        }

        logger.info('Getting events by user:', userId)

        const result = await eventService.getEventsByUser(userId, filters)

        res.status(200).json({
            success: true,
            message: 'User events retrieved successfully',
            data: result
        })

    } catch (error) {
        logger.error('Get user events error:', error)
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

exports.getEventStats = async (req, res) => {
    try {
        logger.info('Getting event statistics')

        const result = await eventService.getEventStats()

        res.status(200).json({
            success: true,
            message: 'Event statistics retrieved successfully',
            data: result.stats
        })

    } catch (error) {
        logger.error('Get event stats error:', error)
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
} 