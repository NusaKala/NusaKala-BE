const generateEventValidationPrompt = (eventData) => {
    return `
INDONESIAN CULTURAL EVENT VALIDATION ANALYSIS

TASK: Analyze the event content for validation with a focus on SARA (Ethnicity, Religion, Race, and Inter-group), cultural relevance, and content quality.

IMPORTANT: Your response must be in English.

EVENT DATA:
Event Name: ${eventData.name || 'N/A'}
Description: ${eventData.description || 'N/A'}
Category: ${eventData.types ? eventData.types.join(', ') : 'N/A'}
Location: ${eventData.place_name || 'N/A'}
Time: ${eventData.start_datetime ? new Date(eventData.start_datetime).toLocaleDateString('en-US') : 'N/A'} - ${eventData.end_datetime ? new Date(eventData.end_datetime).toLocaleDateString('en-US') : 'N/A'}

ANALYSIS INSTRUCTIONS:

1. SARA CONTENT CHECK (Ethnicity, Religion, Race, and Inter-group):
   - Identify words or phrases with potential discriminatory meaning
   - Analyze the context of SARA-related words usage
   - Evaluate whether the content promotes unity or division
   - Check for cultural sensitivity and inclusivity

2. CULTURAL RELEVANCE CHECK:
   - Evaluate the connection to Indonesian culture
   - Check the accuracy of cultural information
   - Analyze the value of cultural heritage
   - Check for regional and local relevance

3. CONTENT QUALITY ASSESSMENT:
   - Evaluate the clarity and completeness of information
   - Check professionalism and content structure
   - Analyze the accuracy of the information provided
   - Check consistency with the event category

4. APPROPRIATENESS EVALUATION:
   - Check if the content is suitable for all ages
   - Evaluate politeness and respect for culture
   - Analyze the safety and security of the content
   - Check alignment with Indonesian values

SCORING SYSTEM:
- POSITIVE (0.8-1.0): Content is very good, safe, and relevant
- NEUTRAL (0.6-0.79): Content is fairly good, needs manual review
- NEGATIVE (0.0-0.59): Problematic content, should be rejected

EXPECTED OUTPUT (JSON FORMAT):

{
  "saraAnalysis": {
    "score": 0.95,
    "status": "POSITIVE",
    "reasoning": "Content focuses on cultural promotion without discriminatory elements",
    "detectedKeywords": [],
    "saraFlags": {
      "ethnicity": { "detected": false, "keywords": [], "context": "No discriminatory ethnic references" },
      "religion": { "detected": false, "keywords": [], "context": "No discriminatory religious references" },
      "race": { "detected": false, "keywords": [], "context": "No discriminatory racial references" },
      "interGroup": { "detected": false, "keywords": [], "context": "No discriminatory inter-group references" }
    },
    "culturalSensitivity": "High",
    "inclusivity": "Good"
  },
  "culturalRelevance": {
    "score": 0.92,
    "status": "POSITIVE",
    "reasoning": "Event is highly relevant to Indonesian culture",
    "indonesianElements": ["batik", "traditional", "Solo", "heritage"],
    "regionalAccuracy": "High",
    "heritageValue": "Significant",
    "localAuthenticity": "Verified"
  },
  "contentQuality": {
    "score": 0.88,
    "status": "POSITIVE",
    "reasoning": "Content is clear, complete, and professional",
    "clarity": "High",
    "completeness": "Good",
    "professionalism": "High",
    "accuracy": "High"
  },
  "appropriateness": {
    "score": 0.90,
    "status": "POSITIVE",
    "reasoning": "Content is suitable for all ages and respects culture",
    "safety": "Safe",
    "respectfulness": "High",
    "culturalSensitivity": "High",
    "ageAppropriateness": "All ages"
  },
  "overallAssessment": {
    "score": 0.91,
    "status": "POSITIVE",
    "recommendation": "auto_approve",
    "confidence": 0.95
  },
  "warnings": [],
  "suggestions": [
    "Consider adding more specific workshop details",
    "Include price information if available"
  ],
  "flags": {
    "saraFlag": false,
    "qualityFlag": false,
    "culturalFlag": false,
    "safetyFlag": false
  }
}

IMPORTANT NOTES:
- Always provide clear and specific reasoning
- If any SARA element is detected, explain the context
- Provide warnings if there are potential issues
- Scoring must be consistent: POSITIVE (0.8-1.0), NEUTRAL (0.6-0.79), NEGATIVE (0.0-0.59)
- If the score is below 0.6, provide a clear reason for rejection
- If there is ambiguous content, recommend manual review

ANALYZE THE FOLLOWING CONTENT:
`;
};

const generateEventUpdateValidationPrompt = (originalEvent, updatedEvent) => {
    return `
INDONESIAN CULTURAL EVENT UPDATE VALIDATION ANALYSIS

TASK: Analyze the changes in event content for validation with a focus on the impact on SARA, culture, and quality.

IMPORTANT: Your response must be in English.

ORIGINAL EVENT:
Name: ${originalEvent.name || 'N/A'}
Description: ${originalEvent.description || 'N/A'}
Category: ${originalEvent.types ? originalEvent.types.join(', ') : 'N/A'}
Status: ${originalEvent.status || 'N/A'}

UPDATED EVENT:
Name: ${updatedEvent.name || 'N/A'}
Description: ${updatedEvent.description || 'N/A'}
Category: ${updatedEvent.types ? updatedEvent.types.join(', ') : 'N/A'}

ANALYSIS INSTRUCTIONS:

1. SARA CONTENT COMPARISON:
   - Compare original vs new content
   - Identify changes affecting SARA
   - Evaluate whether the changes improve or worsen sensitivity

2. CULTURAL RELEVANCE CHANGES:
   - Analyze the impact of changes on cultural relevance
   - Evaluate whether the changes increase or decrease cultural value
   - Check consistency with the event category

3. CONTENT QUALITY CHANGES:
   - Compare content quality before and after
   - Evaluate whether the changes improve clarity and completeness
   - Analyze the impact on professionalism

4. APPROPRIATENESS CHANGES:
   - Evaluate the impact of changes on content appropriateness
   - Check if the changes affect safety or politeness
   - Analyze the impact on cultural sensitivity

SCORING SYSTEM:
- POSITIVE (0.8-1.0): Changes improve quality
- NEUTRAL (0.6-0.79): Changes are neutral, need review
- NEGATIVE (0.0-0.59): Changes worsen quality

EXPECTED OUTPUT (JSON FORMAT):

{
  "changeAnalysis": {
    "saraImpact": {
      "score": 0.95,
      "status": "POSITIVE",
      "reasoning": "Changes do not affect SARA elements",
      "improvements": [],
      "concerns": []
    },
    "culturalImpact": {
      "score": 0.88,
      "status": "POSITIVE", 
      "reasoning": "Changes increase cultural relevance",
      "improvements": ["Added more cultural details"],
      "concerns": []
    },
    "qualityImpact": {
      "score": 0.85,
      "status": "POSITIVE",
      "reasoning": "Changes improve content quality",
      "improvements": ["More complete information"],
      "concerns": []
    }
  },
  "overallChangeAssessment": {
    "score": 0.89,
    "status": "POSITIVE",
    "recommendation": "auto_approve",
    "reasoning": "Overall, the changes improve the event quality"
  },
  "warnings": [],
  "suggestions": [
    "Consider adding more specific location details"
  ]
}

ANALYZE THE FOLLOWING CONTENT CHANGES:
`;
};

module.exports = {
    generateEventValidationPrompt,
    generateEventUpdateValidationPrompt
}; 