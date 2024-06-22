// server.js

const express = require('express');
const routes = require('./routes/index'); // Load all routes from routes/index.js

const app = express();
const port = process.env.PORT || 5000; // Set the port from environment variable or default to 5000

app.use(routes); // Use the routes

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
