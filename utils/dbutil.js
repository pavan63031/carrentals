const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
require('dotenv').config(); // Load .env variables

const url = process.env.MONGODB_URL;
const dbName = process.env.MONGODB_DB;

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect(url)
    .then(client => {
        _db = client.db(dbName);
        callback();
    })
    .catch(err => {
        console.error("Failed to connect to MongoDB:", err);
        throw err;
    });
};

const getdb = () => {
    if (!_db) {
        throw new Error("DB not connected");
    }
    return _db;
};

exports.mongoConnect = mongoConnect;
exports.getdb = getdb;
