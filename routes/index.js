// routes/index.js

const express = require('express');
const router = express.Router();
const AppController = require('../controllers/AppController'); // Load AppController

// Define the endpoint for /status and map it to AppController.getStatus
router.get('/status', AppController.getStatus);

// Define the endpoint for /stats and map it to AppController.getStats
router.get('/stats', AppController.getStats);

module.exports = router;
