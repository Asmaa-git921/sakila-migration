// db/mongoClient.js
const { MongoClient } = require("mongodb");
require("dotenv").config();

const mongoClient = new MongoClient(process.env.MONGO_URI);

module.exports = mongoClient;
