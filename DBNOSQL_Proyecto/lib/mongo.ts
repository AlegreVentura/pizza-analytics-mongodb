import { MongoClient, MongoClientOptions } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI no está definido en .env.local");
}

const uri = process.env.MONGODB_URI;

const options: MongoClientOptions = {
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
  retryWrites: true,
  retryReads: true,
};

// Usar variable global en ambos entornos para reutilizar conexión entre hot-reloads (dev)
// y entre invocaciones en serverless (prod)
const globalMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

if (!globalMongo._mongoClientPromise) {
  const client = new MongoClient(uri, options);
  globalMongo._mongoClientPromise = client.connect().then(async (c) => {
    // Crear índices al conectar — idempotente, no falla si ya existen
    const db = c.db("pizzaDB");
    const col = db.collection("menu");
    await Promise.all([
      col.createIndex({ order_date: 1 }),
      col.createIndex({ pizza_name: 1 }),
      col.createIndex({ mall: 1 }),
      col.createIndex({ mall: 1, order_date: 1 }),
      col.createIndex({ pizza_category: 1 }),
      col.createIndex({ customer_id: 1 }),
    ]).catch((err) => {
      // No abortar si índices fallan (ej. permisos de Atlas)
      console.warn("Advertencia al crear índices:", err.message);
    });
    return c;
  });
}

const clientPromise: Promise<MongoClient> = globalMongo._mongoClientPromise;

export default clientPromise;
