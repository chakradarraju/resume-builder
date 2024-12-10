import { Db, MongoClient, Document } from "mongodb";

if (!process.env.MONGODB_URL) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const defaultDb = 'dev-resumesgenie'
const dbMap = new Map([['prod', 'resumesgenie'], ['dev', defaultDb]]);


const uri = process.env.MONGODB_URL;
const options = {};

let client: MongoClient;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient;
  };

  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options);
  }
  client = globalWithMongo._mongoClient;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
}

export default client;

// Export a module-scoped MongoClient. By doing this in a
// separate module, the client can be shared across functions.
export async function getDb(): Promise<Db> {
  const dbClient = await client;
  return dbClient.db(dbMap.get(process.env.ENV ?? 'dev') ?? defaultDb);
}