require("dotenv").config({ path: "../.env" }); // ← très important
const { MongoClient } = require("mongodb");

console.log("📦 MONGO_URL =", process.env.MONGO_URL);

async function testMongoConnection() {
  try {
    const client = new MongoClient(process.env.MONGO_URL);
    await client.connect();
    console.log("✅ Connexion MongoDB réussie !");
    await client.close();
  } catch (err) {
    console.error("❌ Erreur de connexion MongoDB :", err);
  }
}

testMongoConnection();

