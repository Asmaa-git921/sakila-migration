require('dotenv').config();
const fs = require('fs');
const path = require('path');
const redis = require('redis');

const redisClient = redis.createClient({
  url: process.env.REDIS_URI,
});

async function exportRedisToJson() {
  try {
    await redisClient.connect();
    console.log('🔗 Connecté à Redis.');

    const exportData = {
      countries: [],
      cities: [],
    };

    // 🔹 Exporter les pays
    const countryKeys = await redisClient.keys('country:*');
    for (const key of countryKeys) {
      const data = await redisClient.get(key);
      if (data) exportData.countries.push(JSON.parse(data));
    }
    console.log(`✅ ${exportData.countries.length} pays exportés.`);

    // 🔸 Exporter les villes
    const cityKeys = await redisClient.keys('city:*');
    for (const key of cityKeys) {
      const data = await redisClient.get(key);
      if (data) exportData.cities.push(JSON.parse(data));
    }
    console.log(`✅ ${exportData.cities.length} villes exportées.`);

    // 📁 Enregistrer dans un fichier .json
    const filePath = path.join(__dirname, 'redis_export.json');
    fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2), 'utf8');
    console.log(`📦 Données exportées dans ${filePath}`);

  } catch (err) {
    console.error('❌ Erreur pendant l’export Redis :', err);
  } finally {
    await redisClient.quit();
  }
}

exportRedisToJson();
