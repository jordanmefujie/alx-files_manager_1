// controllers/UsersController.js

import dbClient from '../utils/db.js';
import crypto from 'crypto';

class UsersController {
  // Handle POST /users for creating a new user
  static async postNew(req, res) {
    const { email, password } = req.body;

    // Check if email or password is missing
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    // Check if the email already exists
    const db = dbClient.client.db(dbClient.dbName);
    const userExists = await db.collection('users').findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'Already exist' });
    }

    // Hash the password using SHA1
    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

    // Insert the new user into the database
    const newUser = {
      email,
      password: hashedPassword,
    };
    const result = await db.collection('users').insertOne(newUser);

    // Return the newly created user with email and id
    res.status(201).json({
      id: result.insertedId,
      email: newUser.email,
    });
  }
}

export default UsersController;
