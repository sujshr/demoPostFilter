import { clientRaw } from "../connection/dbConnection.js";

export async function fetchAllPosts() {
  let allPosts = [];
  try {
    const db = clientRaw.db();

    const collection = db.collection("allPosts");

    allPosts = await collection.find({}).toArray();

    console.log("Fetched posts from allPosts collection");
  } catch (error) {
    console.error("Error fetching data from MongoDB:", error);
  }

  return allPosts;
}
