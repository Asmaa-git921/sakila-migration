require('dotenv').config();
const { MongoClient } = require('mongodb');
const fs = require('fs').promises;

async function exportFilmsToJson() {
  const mongoClient = new MongoClient(process.env.MONGO_URI);
  try {
    await mongoClient.connect();
    const db = mongoClient.db('sakila');
    const films = await db.collection('film').find().toArray();

    // Sauvegarde dans un fichier JSON
    await fs.writeFile('exported_films.json', JSON.stringify(films, null, 2), 'utf-8');
    console.log(`✅ Export réussi : ${films.length} films sauvegardés dans exported_films.json`);
  } catch (err) {
    console.error('❌ Erreur lors de l\'export:', err);
  } finally {
    await mongoClient.close();
  }
}

exportFilmsToJson();

