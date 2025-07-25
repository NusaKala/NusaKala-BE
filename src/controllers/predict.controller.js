const predictService = require("../services/predict.service");

exports.predictBatik = async (req, res) => {
    try {
        const imageBuffer = req.file.buffer; 
        const { prediction, confidence } = await predictService.runModel(imageBuffer);


        res.status(200).json({
            success: true,
            prediction: prediction,
            confidence: confidence,
        });
    } catch (error) {
        console.error("Prediction error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
