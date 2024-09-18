import { clientRaw } from "../connection/dbConnection.js";

export async function fetchAllPosts() {
  let allPosts = [];
  try {
    const db = clientRaw.db();

    const collection = db.collection("allposts");

    allPosts = await collection.find({ filtered: false }).toArray();

    console.log("Fetched posts with filtered: false from allPosts collection");
  } catch (error) {
    console.error("Error fetching data from MongoDB:", error);
  }

  return allPosts;
}
