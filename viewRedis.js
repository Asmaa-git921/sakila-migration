require('dotenv').config();
const redis = require('redis');

const redisClient = redis.createClient({
  url: process.env.REDIS_URI,
});

async function viewRedisData() {
  try {
    await redisClient.connect();

    // 🔍 Lister toutes les clés `country:*`
    const countryKeys = await redisClient.keys('country:*');
    console.log(`📦 Clés pays trouvées : ${countryKeys.length}`);
    for (const key of countryKeys) {
      const value = await redisClient.get(key);
      console.log(`🔸 ${key} → ${value}`);
    }

    console.log('\n---\n');

    // 🔍 Lister toutes les clés `city:*`
    const cityKeys = await redisClient.keys('city:*');
    console.log(`🏙️ Clés villes trouvées : ${cityKeys.length}`);
    for (const key of cityKeys.slice(0, 10)) { // Affiche les 10 premières max
      const value = await redisClient.get(key);
      console.log(`🔹 ${key} → ${value}`);
    }

  } catch (err) {
    console.error('❌ Erreur de lecture Redis :', err);
  } finally {
    await redisClient.quit();
  }
}

viewRedisData();
