import { clientRaw } from "../connection/dbConnection.js";

export async function fetchAllPosts() {
  let updatedPosts = [];
  try {
    const db = clientRaw.db();
    const collection = db.collection("allposts");

    updatedPosts = await collection
      .find({ numberOfTimesNeededToBeFiltered: { $gt: 0 } })
      .toArray();

    const result = await collection.updateMany(
      { numberOfTimesNeededToBeFiltered: { $gt: 0 } },
      [
        {
          $set: {
            numberOfTimesNeededToBeFiltered: {
              $subtract: ["$numberOfTimesNeededToBeFiltered", 1],
            },
          },
        },
      ]
    );

    console.log(
      `Fetched ${result.modifiedCount} posts and updated them \n`
    );
  } catch (error) {
    console.error("Error updating and fetching data from MongoDB:", error);
  }

  return updatedPosts;
}
