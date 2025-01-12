import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
	console.log("process.env: ", process.env);
	throw new Error('Invalid environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
	throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
	console.warn("MongoDB <-> DEV ENVIRONMENT")
	let globalWithMongo = global as typeof globalThis & {
		_mongoClientPromise: Promise<MongoClient>;
	};
	if (!globalWithMongo._mongoClientPromise) {
		client = new MongoClient(uri);
		globalWithMongo._mongoClientPromise = client.connect();
	}
	clientPromise = globalWithMongo._mongoClientPromise;
} else {
	console.warn("MongoDB <-> PROD ENVIRONMENT")
	client = new MongoClient(uri, options);
	clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
