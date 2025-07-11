require('dotenv').config();
const { Pool } = require('pg');
const redis = require('redis');
const util = require('util');

// PostgreSQL client
const pg = new Pool({
  connectionString: process.env.PG_URI,
});

// Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URI,
});

(async () => {
  try {
    await redisClient.connect();

    console.log('🔗 Connexion aux bases réussie.');

    //  Migrer les pays
    const countries = await pg.query('SELECT * FROM country');
    for (const country of countries.rows) {
      await redisClient.set(`country:${country.country_id}`, JSON.stringify(country));
    }
    console.log(` ${countries.rowCount} pays migrés vers Redis.`);

    //  Migrer les villes
    const cities = await pg.query('SELECT * FROM city');
    for (const city of cities.rows) {
      await redisClient.set(`city:${city.city_id}`, JSON.stringify(city));
    }
    console.log(` ${cities.rowCount} villes migrées vers Redis.`);

    console.log(' Migration Redis terminée.');

    await redisClient.quit();
    await pg.end();
  } catch (err) {
    console.error(' Erreur pendant la migration Redis :', err);
  }
})();
