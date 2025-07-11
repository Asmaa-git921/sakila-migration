// db/redisClient.js
const redis = require("redis");
require("dotenv").config();

const redisClient = redis.createClient({
  url: process.env.REDIS_URI,
});

redisClient.connect(); // connexion asynchrone

module.exports = redisClient;
