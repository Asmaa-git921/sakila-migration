require('dotenv').config();
console.log("✅ MONGO_URI:", process.env.MONGO_URI);
console.log("✅ PG_URI:", process.env.PG_URI);
const { Pool } = require('pg');
const { MongoClient } = require('mongodb');

const pg = new Pool({ connectionString: process.env.PG_URI });
const mongoClient = new MongoClient(process.env.MONGO_URI);

async function migrate() {
  try {
    await mongoClient.connect();
    const db = mongoClient.db('sakila');

    // 1. Charger les langues
    const languageRes = await pg.query('SELECT * FROM language');
    const languageMap = {};
    for (const l of languageRes.rows) {
      languageMap[l.language_id] = l.name;
    }

    // 2. Charger les catégories
    const categoryRes = await pg.query('SELECT * FROM category');
    const categoryMap = {};
    for (const c of categoryRes.rows) {
      categoryMap[c.category_id] = c.name;
    }

    const filmCategoryRes = await pg.query('SELECT * FROM film_category');
    const filmCategories = {};
    for (const fc of filmCategoryRes.rows) {
      if (!filmCategories[fc.film_id]) filmCategories[fc.film_id] = [];
      filmCategories[fc.film_id].push(categoryMap[fc.category_id]);
    }

    // 3. Charger les acteurs
    const actorRes = await pg.query('SELECT * FROM actor');
    const actorMap = {};
    for (const a of actorRes.rows) {
      actorMap[a.actor_id] = `${a.first_name} ${a.last_name}`;
    }

    const filmActorRes = await pg.query('SELECT * FROM film_actor');
    const filmActors = {};
    for (const fa of filmActorRes.rows) {
      if (!filmActors[fa.film_id]) filmActors[fa.film_id] = [];
      filmActors[fa.film_id].push(actorMap[fa.actor_id]);
    }

    // 4. Récupérer les films et enrichir
    const filmRes = await pg.query('SELECT * FROM film');
    const enrichedFilms = filmRes.rows.map(film => {
      const enriched = {
        ...film,
        categories: filmCategories[film.film_id] || [],
        actors: filmActors[film.film_id] || [],
        language: languageMap[film.language_id] || null,
      };
      delete enriched.language_id;
      return enriched;
    });

    // 5. Insérer dans MongoDB
    await db.collection('film').deleteMany({});
    await db.collection('film').insertMany(enrichedFilms);
    console.log(`${enrichedFilms.length} films enrichis insérés dans MongoDB.`);

  } catch (err) {
    console.error(' Erreur lors de la migration :', err);
  } finally {
    await pg.end();
    await mongoClient.close();
  }
}

migrate();

