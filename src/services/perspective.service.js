const { google } = require('googleapis');
const DISCOVERY_URL = 'https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1';

let clientPromise = google.discoverAPI(DISCOVERY_URL);

exports.analyzeText = async (text) => {
    const client = await clientPromise;

    const analyzeRequest = {
        comment: { text },
        requestedAttributes: {
            TOXICITY: {},
            INSULT: {},
            PROFANITY: {},
            THREAT: {},
            SEXUALLY_EXPLICIT: {},
            IDENTITY_ATTACK: {},
        },
    };

    return new Promise((resolve, reject) => {
        client.comments.analyze(
            {
                key: process.env.PERSPECTIVE_API_KEY,
                resource: analyzeRequest,
            },
            (err, response) => {
                if (err) return reject(err);
                resolve(response.data);
            }
        );
    });
};
