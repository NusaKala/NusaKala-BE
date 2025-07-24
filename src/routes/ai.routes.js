const express = require("express");
const router = express.Router();
const { handleAsk } = require("../controllers/ai.controller");

router.post("/ask", handleAsk);

module.exports = router;
