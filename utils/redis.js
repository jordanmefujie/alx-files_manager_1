// utils/redis.js

import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient();

    // Listen for errors and log them
    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    // Connect the client
    this.client.connect();
  }

  // Check if Redis connection is alive
  isAlive() {
    return this.client.connected;
  }

  // Get the value for a given key
  async get(key) {
    try {
      const value = await this.client.get(key);
      return value;
    } catch (error) {
      console.error('Error getting key from Redis:', error);
      return null;
    }
  }

  // Set a key with a value and an expiration time in seconds
  async set(key, value, duration) {
    try {
      await this.client.set(key, value, {
        EX: duration, // Expiration in seconds
      });
    } catch (error) {
      console.error('Error setting key in Redis:', error);
    }
  }

  // Delete a key from Redis
  async del(key) {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error('Error deleting key from Redis:', error);
    }
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;
