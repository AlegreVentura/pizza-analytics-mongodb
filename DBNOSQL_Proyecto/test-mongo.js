require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('Error: MONGODB_URI no definido en .env.local');
  process.exit(1);
}

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('pizzaDB');
    const collection = db.collection('menu');
    const count = await collection.countDocuments();
    console.log(`Conexion exitosa. Documentos en 'menu': ${count}`);
  } catch (err) {
    console.error('Error al conectar:', err.message);
  } finally {
    await client.close();
  }
}

run();
