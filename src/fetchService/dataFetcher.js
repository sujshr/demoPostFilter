import { clientRaw } from "../connection/dbConnection.js";

export async function fetchAllPosts() {
  let allPosts = [];
  try {
    const db = clientRaw.db();
    const collection = db.collection("allposts");

    allPosts = await collection
      .find({
        numberOfTimesNeededToBeFiltered: { $gt: 0 },
      })
      .toArray();

    console.log(
      "Fetched posts from allPosts collection where numberOfTimesNeededToBeFiltered > 0"
    );
  } catch (error) {
    console.error("Error fetching data from MongoDB:", error);
  }

  return allPosts;
}
