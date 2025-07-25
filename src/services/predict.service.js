const tf = require("@tensorflow/tfjs");
const jpeg = require("jpeg-js");

let modelPromise = null;
async function loadModel() {
    if (!modelPromise) {
        const modelUrl = 'http://localhost:3001/model/tfjs-mod/model.json';
        modelPromise = tf.loadGraphModel(modelUrl);
    }
    return modelPromise;
}

function bufferToTensor(buffer) {
    const image = jpeg.decode(buffer, true);
    const { width, height, data } = image;

    const numPixels = width * height;
    const rgbData = new Uint8Array(numPixels * 3);
    for (let i = 0; i < numPixels; i++) {
        rgbData[i * 3 + 0] = data[i * 4 + 0];
        rgbData[i * 3 + 1] = data[i * 4 + 1];
        rgbData[i * 3 + 2] = data[i * 4 + 2];
    }

    const imageTensor = tf.tensor3d(rgbData, [height, width, 3]);
    const resized = tf.image.resizeBilinear(imageTensor, [224, 224]);
    const normalized = resized.div(255.0).expandDims(0);
    return normalized;
}


exports.runModel = async (imageBuffer) => {
    const model = await loadModel();
    const inputTensor = bufferToTensor(imageBuffer);
    const prediction = model.predict(inputTensor);
    const predictionArray = prediction.dataSync();
    const predictedIndex = predictionArray.indexOf(Math.max(...predictionArray));

    return {
        prediction: predictedIndex,
        confidence: predictionArray[predictedIndex]
    };
};
