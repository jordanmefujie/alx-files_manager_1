import redisClient from '../utils/redis.js';
import dbClient from '../utils/db.js';

export default class AppController {
  static async getStatus(req, res) {
    try {
      const redisAlive = await redisClient.isAlive();
      const dbAlive = await dbClient.isAlive();
      res.status(200).json({ redis: redisAlive, db: dbAlive });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getStats(req, res) {
    try {
      const usersCount = await dbClient.users.count();
      const filesCount = await dbClient.files.count();
      res.status(200).json({ users: usersCount, files: filesCount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
