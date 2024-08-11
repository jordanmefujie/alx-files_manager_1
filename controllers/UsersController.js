// controllers/UsersController.js file

const crypto = require('crypto');
const dbClient = require('../utils/db');

class UsersController {
    // POST /users
    static async postNew(req, res) {
        const { email, password } = req.body;

        // Check if email is provided
        if (!email) {
            return res.status(400).json({ error: 'Missing email' });
        }

        // Check if password is provided
        if (!password) {
            return res.status(400).json({ error: 'Missing password' });
        }

        // Check if the email already exists in the database
        const userExists = await dbClient.db.collection('users').findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'Already exist' });
        }

        // Hash the password using SHA1
        const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

        // Insert the new user into the database
        const result = await dbClient.db.collection('users').insertOne({
            email,
            password: hashedPassword
        });

        // Return the new user with only the email and the id
        const newUser = { email, id: result.insertedId };
        return res.status(201).json(newUser);
    }
}

module.exports = UsersController;
