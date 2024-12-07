import { MongoClient } from "mongodb";
import "dotenv/config";

const clientDb = new MongoClient(process.env.MONGODB_ATLAS_URI);

let unfilteredPostsCollection;
let disasterPostsCollection;

export async function connectDB() {
  try {
    await clientDb.connect();
    unfilteredPostsCollection = clientDb.db().collection("unfilteredposts");
    disasterPostsCollection = clientDb.db().collection("disasterPosts");
    console.log("Successfully connected to Sahayog Database! \n");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

export { clientDb, unfilteredPostsCollection, disasterPostsCollection };
