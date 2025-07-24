const eventValidationService = require('../services/event-validation.service');
const logger = require('../utils/logger');

exports.validateEvent = async (req, res) => {
    try {
        const eventData = req.body;
        
        logger.info('Validating event:', eventData.name);
        
        const validationResult = await eventValidationService.validateEvent(eventData);
        
        res.status(200).json({
            success: true,
            message: 'Event validation completed',
            data: {
                status: validationResult.status,
                score: validationResult.score,
                method: validationResult.method,
                decision: validationResult.decision,
                analysis: {
                    gemini: validationResult.analysis.gemini,
                    perspective: validationResult.analysis.perspective
                },
                suggestions: validationResult.suggestions,
                warnings: validationResult.warnings
            }
        });
        
    } catch (error) {
        logger.error('Event validation controller error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.validateEventUpdate = async (req, res) => {
    try {
        const { eventId } = req.params;
        const eventData = req.body;
        const originalEvent = req.body.originalEvent;
        
        logger.info('Validating event update:', eventData.name);
        
        const validationResult = await eventValidationService.validateEventUpdate(
            eventId, 
            eventData, 
            originalEvent
        );
        
        res.status(200).json({
            success: true,
            message: 'Event update validation completed',
            data: {
                status: validationResult.status,
                score: validationResult.score,
                method: validationResult.method,
                decision: validationResult.decision,
                analysis: {
                    gemini: validationResult.analysis.gemini,
                    perspective: validationResult.analysis.perspective
                },
                suggestions: validationResult.suggestions,
                warnings: validationResult.warnings
            }
        });
        
    } catch (error) {
        logger.error('Event update validation controller error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
