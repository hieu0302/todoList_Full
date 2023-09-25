import { MongoClient } from "mongodb";


const DATABASE = "todo-list";

const db = {};

const connectToDatabase = async () => {
  try {
    const mongoClient = new MongoClient(process.env.MONGO_URI);
    await mongoClient.connect();

    console.log("Database connected successfully");
    const database = mongoClient.db(DATABASE);

    // Collections
    db.todos = database.collection("todos");
  } catch (error) {
    console.error("Connect to DB failed:", error);
    process.exit(1);
  }
};

export { connectToDatabase, db };
