import { unfilteredPostsCollection } from "../connection/dbConnection.js";

export async function fetchAllPosts() {
  let allPosts = [];
  try {
    allPosts = await unfilteredPostsCollection
      .find({
        filtered: false,
        "post.imageUrl": null,
      })
      .toArray();
  } catch (error) {
    console.error("Error updating and fetching data from MongoDB:", error);
  }

  return allPosts;
}
