require('dotenv').config();
const { MongoClient } = require('mongodb');

async function showData() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db('sakila');

  const actors = await db.collection('actor').find().limit(5).toArray();
  console.log('👥 Acteurs :', actors);

  await client.close();
}

showData();
