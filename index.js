import { connectDB } from "./src/connection/dbConnection.js";
import { fetchAllPosts } from "./src/fetchService/dataFetcher.js";
import { filterData } from "./src/filterService/dataFilter.js";
import { updateDatabase } from "./src/postService/dataPoster.js";

async function main() {
  try {
    await connectDB();

    const posts = await fetchAllPosts();

    const filteredData = await filterData(posts);

    console.log(filteredData);

    updateDatabase(filteredData);
  } catch (error) {
    console.error("Error in fetching posts:", error);
  }
}

main();
