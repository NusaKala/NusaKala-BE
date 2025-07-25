// predict.route.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer(); 

const predictController = require("../controllers/predict.controller");

router.post("/batik", upload.single("image"), predictController.predictBatik);

module.exports = router;
