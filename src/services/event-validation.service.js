const { askGemini } = require('./ai.service');
const { analyzeText } = require('./perspective.service');
const { generateEventValidationPrompt, generateEventUpdateValidationPrompt } = require('../utils/event-validation-prompt');
const logger = require('../utils/logger');

class EventValidationService {
    async validateEvent(eventData) {
        try {
            const basicValidation = this.validateBasicFields(eventData);
            if (!basicValidation.isValid) {
                return {
                    status: 'rejected',
                    reason: basicValidation.errors,
                    score: 0,
                    method: 'basic_validation',
                    decision: {
                        status: 'rejected',
                        method: 'basic_validation',
                        reason: 'Basic validation failed',
                        details: basicValidation.errors
                    },
                    analysis: {
                        gemini: null,
                        perspective: null
                    },
                    suggestions: [],
                    warnings: basicValidation.errors
                };
            }

            const geminiAnalysis = await this.performGeminiAnalysis(eventData);
            const perspectiveAnalysis = await this.checkToxicity(eventData.description);
            const finalScore = this.calculateFinalScore(geminiAnalysis, perspectiveAnalysis);
            const decision = this.makeDecision(finalScore, geminiAnalysis, perspectiveAnalysis);

            return {
                status: decision.status,
                score: finalScore,
                method: decision.method,
                analysis: {
                    gemini: geminiAnalysis,
                    perspective: perspectiveAnalysis
                },
                decision: decision,
                suggestions: geminiAnalysis.suggestions || [],
                warnings: geminiAnalysis.warnings || []
            };

        } catch (error) {
            logger.error('Event validation error:', error);
            throw error;
        }
    }

    async validateEventUpdate(eventId, eventData, originalEvent) {
        try {
            const basicValidation = this.validateBasicFields(eventData);
            if (!basicValidation.isValid) {
                return {
                    status: 'rejected',
                    reason: basicValidation.errors,
                    score: 0,
                    method: 'basic_validation',
                    decision: {
                        status: 'rejected',
                        method: 'basic_validation',
                        reason: 'Basic validation failed',
                        details: basicValidation.errors
                    },
                    analysis: {
                        gemini: null,
                        perspective: null
                    },
                    suggestions: [],
                    warnings: basicValidation.errors
                };
            }

            const geminiAnalysis = await this.performGeminiUpdateAnalysis(eventData, originalEvent);
            const perspectiveAnalysis = await this.checkToxicity(eventData.description);
            const finalScore = this.calculateFinalScore(geminiAnalysis, perspectiveAnalysis);
            const decision = this.makeDecision(finalScore, geminiAnalysis, perspectiveAnalysis);

            return {
                status: decision.status,
                score: finalScore,
                method: decision.method,
                analysis: {
                    gemini: geminiAnalysis,
                    perspective: perspectiveAnalysis
                },
                decision: decision,
                suggestions: geminiAnalysis.suggestions || [],
                warnings: geminiAnalysis.warnings || []
            };

        } catch (error) {
            logger.error('Event update validation error:', error);
            throw error;
        }
    }

    validateBasicFields(eventData) {
        const errors = [];
        
        if (!eventData.name) errors.push('Event name is required');
        if (!eventData.description) errors.push('Event description is required');
        if (!eventData.types || eventData.types.length === 0) errors.push('Event categories are required');
        if (!eventData.place_name) errors.push('Event location is required');
        if (!eventData.start_datetime) errors.push('Start date is required');
        if (!eventData.end_datetime) errors.push('End date is required');

        if (eventData.start_datetime && eventData.end_datetime) {
            const startDate = new Date(eventData.start_datetime);
            const endDate = new Date(eventData.end_datetime);
            const now = new Date();

            if (startDate < now) {
                errors.push('Start date cannot be in the past');
            }
            if (endDate <= startDate) {
                errors.push('End date must be after start date');
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    async performGeminiAnalysis(eventData) {
        try {
            const prompt = generateEventValidationPrompt(eventData);
            const response = await askGemini(prompt);

            const analysis = this.parseGeminiResponse(response);
            
            logger.info('Gemini analysis completed for event:', eventData.name);
            return analysis;
        } catch (error) {
            logger.error('Gemini analysis failed:', error);
            throw new Error(`AI analysis failed: ${error.message}`);
        }
    }

    async performGeminiUpdateAnalysis(eventData, originalEvent) {
        try {
            const prompt = generateEventUpdateValidationPrompt(originalEvent, eventData);
            const response = await askGemini(prompt);
            
            const analysis = this.parseGeminiResponse(response);
            
            logger.info('Gemini update analysis completed for event:', eventData.name);
            return analysis;
        } catch (error) {
            logger.error('Gemini update analysis failed:', error);
            throw new Error(`AI update analysis failed: ${error.message}`);
        }
    }

    parseGeminiResponse(response) {
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            } else {
                return this.createStructuredResponse(response);
            }
        } catch (error) {
            logger.error('Failed to parse Gemini response:', error);
            return this.createStructuredResponse(response);
        }
    }

    createStructuredResponse(response) {
        return {
            saraAnalysis: {
                score: 0.5,
                status: "NETRAL",
                reasoning: "Unable to parse AI response",
                detectedKeywords: [],
                saraFlags: {
                    suku: { detected: false, keywords: [], context: "Analysis unavailable" },
                    agama: { detected: false, keywords: [], context: "Analysis unavailable" },
                    ras: { detected: false, keywords: [], context: "Analysis unavailable" },
                    antarGolongan: { detected: false, keywords: [], context: "Analysis unavailable" }
                }
            },
            culturalRelevance: {
                score: 0.5,
                status: "NETRAL",
                reasoning: "Unable to parse AI response"
            },
            contentQuality: {
                score: 0.5,
                status: "NETRAL",
                reasoning: "Unable to parse AI response"
            },
            appropriateness: {
                score: 0.5,
                status: "NETRAL",
                reasoning: "Unable to parse AI response"
            },
            overallAssessment: {
                score: 0.5,
                status: "NETRAL",
                recommendation: "manual_review",
                confidence: 0.5
            },
            warnings: ["AI response parsing failed"],
            suggestions: ["Please review content manually"]
        };
    }

    async checkToxicity(text) {
        try {
            const analysis = await analyzeText(text);
            return {
                toxicity: analysis.attributeScores.TOXICITY.summaryScore.value,
                insult: analysis.attributeScores.INSULT.summaryScore.value,
                profanity: analysis.attributeScores.PROFANITY.summaryScore.value,
                threat: analysis.attributeScores.THREAT.summaryScore.value,
                sexuallyExplicit: analysis.attributeScores.SEXUALLY_EXPLICIT.summaryScore.value,
                identityAttack: analysis.attributeScores.IDENTITY_ATTACK.summaryScore.value
            };
        } catch (error) {
            logger.error('Toxicity check failed:', error);
            return {
                toxicity: 0,
                insult: 0,
                profanity: 0,
                threat: 0,
                sexuallyExplicit: 0,
                identityAttack: 0
            };
        }
    }

    calculateFinalScore(geminiAnalysis, perspectiveAnalysis) {
        try {
            const saraScore = geminiAnalysis.saraAnalysis?.score || 0.5;
            const culturalScore = geminiAnalysis.culturalRelevance?.score || 0.5;
            const qualityScore = geminiAnalysis.contentQuality?.score || 0.5;
            const appropriatenessScore = geminiAnalysis.appropriateness?.score || 0.5;

            const toxicityPenalty = perspectiveAnalysis.toxicity * 0.15;
            const identityAttackPenalty = perspectiveAnalysis.identityAttack * 0.10;
            const threatPenalty = perspectiveAnalysis.threat * 0.10;

            const finalScore = (
                saraScore * 0.35 +
                culturalScore * 0.25 +
                qualityScore * 0.20 +
                appropriatenessScore * 0.20
            ) - toxicityPenalty - identityAttackPenalty - threatPenalty;

            return Math.max(0, Math.min(1, finalScore));
        } catch (error) {
            logger.error('Score calculation failed:', error);
            return 0.5;
        }
    }

    makeDecision(score, geminiAnalysis, perspectiveAnalysis) {
        if (perspectiveAnalysis.toxicity > 0.7 || 
            perspectiveAnalysis.identityAttack > 0.7 ||
            perspectiveAnalysis.threat > 0.7) {
            return {
                status: 'rejected',
                method: 'auto',
                reason: 'Content contains inappropriate or harmful elements',
                details: {
                    toxicity: perspectiveAnalysis.toxicity,
                    identityAttack: perspectiveAnalysis.identityAttack,
                    threat: perspectiveAnalysis.threat
                }
            };
        }

        const saraFlags = geminiAnalysis.saraAnalysis?.saraFlags;
        if (saraFlags) {
            const hasSaraContent = Object.values(saraFlags).some(flag => flag.detected);
            if (hasSaraContent) {
                return {
                    status: 'rejected',
                    method: 'auto',
                    reason: 'Content contains SARA elements',
                    details: saraFlags
                };
            }
        }

        if (score >= 0.8) {
            return {
                status: 'approved',
                method: 'auto',
                reason: 'High quality content with good cultural relevance',
                score: score
            };
        } else if (score >= 0.6) {
            return {
                status: 'pending_review',
                method: 'manual',
                reason: 'Content needs manual review',
                score: score
            };
        } else {
            return {
                status: 'rejected',
                method: 'auto',
                reason: 'Content does not meet quality standards',
                score: score
            };
        }
    }

    getToxicityLevel(toxicityScore) {
        if (toxicityScore >= 0.7) return 'HIGH';
        if (toxicityScore >= 0.4) return 'MEDIUM';
        return 'LOW';
    }
}

module.exports = new EventValidationService(); 