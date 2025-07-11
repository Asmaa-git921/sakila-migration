// db/pgClient.js
const { Pool } = require("pg");
require("dotenv").config();

const pg = new Pool({
  connectionString: process.env.PG_URI,
});

module.exports = pg;
