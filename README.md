# sakila-migration

Projet de migration de données depuis une base PostgreSQL vers deux systèmes NoSQL :  
- **MongoDB Atlas** (stockage structuré de films enrichis)  
- **Redis** (stockage clé-valeur pour données simples)  
Le tout à l'aide de **Node.js** et **Docker**.

---

## Prérequis

- [Node.js](https://nodejs.org/) (v18+ recommandé)
- [Docker](https://www.docker.com/)
- [RedisInsight](https://redis.io/docs/redis-insight/)
- [pgAdmin](https://www.pgadmin.org/)
- Compte MongoDB Atlas (Cloud)

---

## 📁 Structure du projet

```
sakila-migration/
│
├── db/
│   ├── mongoClient.js             # Utilitaire de connexion à MongoDB
│   ├── pgClient.js                # Utilitaire de connexion à PostgreSQL
│   ├── redisClient.js             # Utilitaire de connexion à Redis
│   ├── testMongo.js               # Test de connexion MongoDB
│
├── init/
│   ├── sakila-schema.sql          # Script SQL pour initialiser la BDD PostgreSQL
│   ├── sakila-data-utf8.sql       # Données à importer dans PostgreSQL (UTF-8)
│   └── sakila-data.sql             # Données originales Sakila
│
├── migrateToMongo.js              # Migration et enrichissement des films vers MongoDB
├── migrateToRedis.js              # Migration de données simples vers Redis
├── exportMongoToJson.js           # Export des films enrichis depuis MongoDB
├── exportRedisToJson.js           # Export des données Redis vers JSON
├── viewRedis.js                   # Affichage des données Redis
├── import_sakila.bat              # Script Windows pour importer les données Sakila
├── .env                           # Configuration des URI
├── docker-compose.yml             # Conteneurs PostgreSQL & Redis
└── package.json
```

---

## ⚙️ Configuration `.env`

Créer un fichier `.env` à la racine avec :

```env
# PostgreSQL (local Docker)
PG_URI=postgresql://sakila_user:asmadmin@localhost:5432/sakila

# Redis (local Docker)
REDIS_URI=redis://localhost:6379

# MongoDB Atlas (Cloud)
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/?retryWrites=true&w=majority
```

> Remplacer `<username>` et `<password>` par vos identifiants MongoDB Atlas.

---

## 🐳 Lancement des services avec Docker

```bash
docker compose up -d
```

Services lancés :
- PostgreSQL → `localhost:5432`
- Redis → `localhost:6379`

---

## 📦 Installation des dépendances Node.js

```bash
npm install
```

---

## 🚀 Migration des données

### ➤ Migration vers MongoDB Atlas

```bash
node migrateToMongo.js
```

Cette étape :
- Récupère les films depuis PostgreSQL
- Enrichit chaque film avec :
  - ses **catégories** (via `film_category`)
  - sa **langue** (via `language`)
  - ses **acteurs** (via `film_actor`)
- Insère les films enrichis dans la collection `film` de MongoDB

### ➤ Migration vers Redis

```bash
node migrateToRedis.js
```

Cette étape migre les entités simples comme :
- `country`
- `city`

vers un modèle clé-valeur dans Redis.

---

## 🔍 Vérification et export

### ➤ Tester la connexion à MongoDB

```bash
node db/testMongo.js
```

### ➤ Afficher les données Redis

```bash
node viewRedis.js
```

### ➤ Exporter les données Redis vers JSON

```bash
node exportRedisToJson.js
```

Fichier généré : `redis_export.json`

### ➤ Exporter les films enrichis de MongoDB vers JSON

```bash
node exportMongoToJson.js
```

Fichier généré : `exported_films.json`  
Contient tous les films avec leurs **acteurs**, **catégories**, et **langue**.

---

## 📂 Exécution sur une autre machine

1. Cloner le projet :
   ```bash
   git clone <lien_git>
   cd sakila-migration
   ```

2. Installer les dépendances :
   ```bash
   npm install
   ```

3. Lancer les services :
   ```bash
   docker compose up -d
   ```

4. Créer et configurer `.env`

5. Importer les données dans PostgreSQL (si nécessaire) :
   - Sous Windows :
     ```bash
     import_sakila.bat
     ```

6. Exécuter les migrations :
   ```bash
   node migrateToMongo.js
   node migrateToRedis.js
   ```

---

## 📌 Résultat attendu

| Base     | Données traitées                      | Format final                     | Accès via                   |
|----------|----------------------------------------|----------------------------------|-----------------------------|
| MongoDB  | `film` enrichi avec `actor`, `category`, `language` | Documents JSON enrichis         | MongoDB Atlas / Compass     |
| Redis    | `country`, `city`                      | Clés simples avec valeurs        | RedisInsight / CLI          |

---
