const { query } = require('../../config/database')
const eventValidationService = require('./event-validation.service')
const logger = require('../utils/logger')

class EventService {
    async createEvent(eventData, userId) {
        try {
            const validationResult = await eventValidationService.validateEvent(eventData)
            
            if (validationResult.status === 'rejected') {
                throw new Error(`Event validation failed: ${validationResult.decision?.reason || 'Content does not meet requirements'}`)
            }

            const eventToSave = {
                ...eventData,
                created_by: userId
            }

            const insertQuery = `
                INSERT INTO events (
                    name, types, description, images, links, place_name, 
                    latitude, longitude, start_datetime, end_datetime, 
                    created_by
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                RETURNING *
            `

            const values = [
                eventToSave.name,
                eventToSave.types,
                eventToSave.description,
                eventToSave.images || [],
                eventToSave.links || [],
                eventToSave.place_name,
                eventToSave.latitude,
                eventToSave.longitude,
                eventToSave.start_datetime,
                eventToSave.end_datetime,
                eventToSave.created_by
            ]

            const result = await query(insertQuery, values)
            
            logger.info('Event created successfully:', result.rows[0].id)
            
            return {
                success: true,
                event: result.rows[0],
                validation: validationResult
            }

        } catch (error) {
            logger.error('Event creation failed:', error)
            throw error
        }
    }

    async getAllEvents(filters = {}) {
        try {
            let whereClause = 'WHERE 1=1'
            const queryParams = []
            let paramIndex = 1

            if (filters.type && filters.type !== 'all') {
                whereClause += ` AND $${paramIndex} = ANY(types)`
                queryParams.push(filters.type)
                paramIndex++
            }

            if (filters.startDate) {
                whereClause += ` AND start_datetime >= $${paramIndex}`
                queryParams.push(filters.startDate)
                paramIndex++
            }

            if (filters.endDate) {
                whereClause += ` AND end_datetime <= $${paramIndex}`
                queryParams.push(filters.endDate)
                paramIndex++
            }

            if (filters.latitude && filters.longitude && filters.radius) {
                whereClause += ` AND (
                    6371 * acos(
                        cos(radians($${paramIndex})) * cos(radians(latitude)) * 
                        cos(radians(longitude) - radians($${paramIndex + 1})) + 
                        sin(radians($${paramIndex})) * sin(radians(latitude))
                    ) <= $${paramIndex + 2}
                )`
                queryParams.push(filters.latitude, filters.longitude, filters.radius)
                paramIndex += 3
            }

            const selectQuery = `
                SELECT 
                    e.*,
                    u.email as creator_email,
                    u.avatar_url as creator_avatar
                FROM events e
                LEFT JOIN users u ON e.created_by = u.id
                ${whereClause}
                ORDER BY e.created_at DESC
                ${filters.limit ? `LIMIT $${paramIndex}` : ''}
                ${filters.offset ? `OFFSET $${paramIndex + 1}` : ''}
            `

            if (filters.limit) {
                queryParams.push(filters.limit)
                if (filters.offset) {
                    queryParams.push(filters.offset)
                }
            }

            const result = await query(selectQuery, queryParams)
            
            logger.info(`Retrieved ${result.rows.length} events`)
            
            return {
                success: true,
                events: result.rows,
                total: result.rows.length
            }

        } catch (error) {
            logger.error('Failed to retrieve events:', error)
            throw error
        }
    }

    async getEventById(eventId) {
        try {
            const selectQuery = `
                SELECT 
                    e.*,
                    u.email as creator_email,
                    u.avatar_url as creator_avatar
                FROM events e
                LEFT JOIN users u ON e.created_by = u.id
                WHERE e.id = $1
            `

            const result = await query(selectQuery, [eventId])

            if (result.rows.length === 0) {
                throw new Error('Event not found')
            }

            logger.info('Event retrieved successfully:', eventId)
            
            return {
                success: true,
                event: result.rows[0]
            }

        } catch (error) {
            logger.error('Failed to retrieve event:', error)
            throw error
        }
    }

    async updateEvent(eventId, eventData, userId) {
        try {
            const existingEvent = await this.getEventById(eventId)
            if (!existingEvent.success) {
                throw new Error('Event not found')
            }

            if (existingEvent.event.created_by !== userId) {
                throw new Error('Unauthorized: You can only update your own events')
            }

            const validationResult = await eventValidationService.validateEventUpdate(
                eventId, 
                eventData, 
                existingEvent.event
            )

            if (validationResult.status === 'rejected') {
                throw new Error(`Event update validation failed: ${validationResult.decision?.reason || 'Content does not meet requirements'}`)
            }

            const updateQuery = `
                UPDATE events SET
                    name = $1,
                    types = $2,
                    description = $3,
                    images = $4,
                    links = $5,
                    place_name = $6,
                    latitude = $7,
                    longitude = $8,
                    start_datetime = $9,
                    end_datetime = $10,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = $11 AND created_by = $12
                RETURNING *
            `

            const values = [
                eventData.name,
                eventData.types,
                eventData.description,
                eventData.images || [],
                eventData.links || [],
                eventData.place_name,
                eventData.latitude,
                eventData.longitude,
                eventData.start_datetime,
                eventData.end_datetime,
                eventId,
                userId
            ]

            const result = await query(updateQuery, values)

            if (result.rows.length === 0) {
                throw new Error('Event not found or unauthorized')
            }

            logger.info('Event updated successfully:', eventId)
            
            return {
                success: true,
                event: result.rows[0],
                validation: validationResult
            }

        } catch (error) {
            logger.error('Event update failed:', error)
            throw error
        }
    }

    async deleteEvent(eventId, userId) {
        try {
            const existingEvent = await this.getEventById(eventId)
            if (!existingEvent.success) {
                throw new Error('Event not found')
            }

            if (existingEvent.event.created_by !== userId) {
                throw new Error('Unauthorized: You can only delete your own events')
            }

            const deleteQuery = `
                DELETE FROM events 
                WHERE id = $1 AND created_by = $2
                RETURNING id
            `

            const result = await query(deleteQuery, [eventId, userId])

            if (result.rows.length === 0) {
                throw new Error('Event not found or unauthorized')
            }

            logger.info('Event deleted successfully:', eventId)
            
            return {
                success: true,
                message: 'Event deleted successfully'
            }

        } catch (error) {
            logger.error('Event deletion failed:', error)
            throw error
        }
    }

    async getEventsByUser(userId, filters = {}) {
        try {
            let whereClause = 'WHERE e.created_by = $1'
            const queryParams = [userId]
            let paramIndex = 2

            const selectQuery = `
                SELECT 
                    e.*,
                    u.email as creator_email,
                    u.avatar_url as creator_avatar
                FROM events e
                LEFT JOIN users u ON e.created_by = u.id
                ${whereClause}
                ORDER BY e.created_at DESC
                ${filters.limit ? `LIMIT $${paramIndex}` : ''}
                ${filters.offset ? `OFFSET $${paramIndex + 1}` : ''}
            `

            if (filters.limit) {
                queryParams.push(filters.limit)
                if (filters.offset) {
                    queryParams.push(filters.offset)
                }
            }

            const result = await query(selectQuery, queryParams)
            
            logger.info(`Retrieved ${result.rows.length} events for user ${userId}`)
            
            return {
                success: true,
                events: result.rows,
                total: result.rows.length
            }

        } catch (error) {
            logger.error('Failed to retrieve user events:', error)
            throw error
        }
    }

    async getEventStats() {
        try {
            const statsQuery = `
                SELECT 
                    COUNT(*) as total_events
                FROM events
            `

            const result = await query(statsQuery)
            
            return {
                success: true,
                stats: {
                    total_events: result.rows[0].total_events,
                    approved_events: 0,
                    pending_events: 0, 
                    rejected_events: 0, 
                    avg_validation_score: 0
                }
            }

        } catch (error) {
            logger.error('Failed to get event stats:', error)
            throw error
        }
    }
}

module.exports = new EventService() 