// server.js

import express from 'express';
import routes from './routes/index.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// Use routes from routes/index.js
app.use('/', routes);

// Set the port from environment or default to 5000
const port = process.env.PORT || 5000;

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
