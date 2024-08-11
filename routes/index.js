// routes/index.js file

const express = require('express');
const router = express.Router();
const AppController = require('../controllers/AppController'); // Load AppController
const UsersController = require('../controllers/UsersController'); // Import UsersController

// Define the endpoint for /status and map it to AppController.getStatus
router.get('/status', AppController.getStatus);

// Define the endpoint for /stats and map it to AppController.getStats
router.get('/stats', AppController.getStats);

// Add a new endpoint for creating users
router.post('/users', UsersController.postNew);

module.exports = router;
