// utils/db.js updated

const { MongoClient } = require('mongodb');

class DBClient {
    constructor() {
        const host = process.env.DB_HOST || 'localhost';
        const port = process.env.DB_PORT || 27017;
        const database = process.env.DB_DATABASE || 'files_manager';
        const uri = `mongodb://${host}:${port}`;

        this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        this.client.connect()
            .then(() => {
                this.db = this.client.db(database); // Assign the database
            })
            .catch((err) => {
                console.error('MongoDB client not connected to the server:', err);
            });
    }

    isAlive() {
        return this.client && this.client.isConnected(); // Check if the client is connected
    }

    async nbUsers() {
        try {
            return await this.db.collection('users').countDocuments(); // Count documents in the users collection
        } catch (err) {
            console.error('Error counting users:', err);
            return 0;
        }
    }

    async nbFiles() {
        try {
            return await this.db.collection('files').countDocuments(); // Count documents in the files collection
        } catch (err) {
            console.error('Error counting files:', err);
            return 0;
        }
    }
}

const dbClient = new DBClient();
module.exports = dbClient;
