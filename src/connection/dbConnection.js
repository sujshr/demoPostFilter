import { MongoClient } from "mongodb";
import "dotenv/config";

const clientRaw = new MongoClient(process.env.MONGODB_ATLAS_URI_RAW);
const clientDb = new MongoClient(process.env.MONGODB_ATLAS_URI);

export async function connectDB() {
  try {
    await clientRaw.connect();
    console.log("Successfully connected to DemoSocialMedia Database! \n");

    await clientDb.connect();
    console.log("Successfully connected to Sahayog Database! \n");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

export { clientRaw, clientDb };
