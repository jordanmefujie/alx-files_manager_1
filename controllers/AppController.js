// controllers/AppController.js

const redisClient = require('../utils/redis'); // Load RedisClient
const dbClient = require('../utils/db'); // Load DBClient

class AppController {
    // GET /status
    static async getStatus(req, res) {
        const redisAlive = redisClient.isAlive();
        const dbAlive = dbClient.isAlive();
        // Return the status of Redis and DB with status code 200
        res.status(200).json({ redis: redisAlive, db: dbAlive });
    }

    // GET /stats
    static async getStats(req, res) {
        const nbUsers = await dbClient.nbUsers();
        const nbFiles = await dbClient.nbFiles();
        // Return the number of users and files with status code 200
        res.status(200).json({ users: nbUsers, files: nbFiles });
    }
}

module.exports = AppController;
