import express from "express";
import { connectDB } from "./src/connection/dbConnection.js";
import { fetchAllPosts } from "./src/fetchService/dataFetcher.js";
import { filterData } from "./src/filterService/dataFilter.js";
import { updateDatabase } from "./src/postService/dataPoster.js";
import statsRoute from "./src/routes/statsRoute.js"; // Import the stats route

const app = express();
const PORT = process.env.PORT || 3000;

async function main() {
  try {
    await connectDB();

    const posts = await fetchAllPosts();
    const filteredData = await filterData(posts);

    console.log("Filtered Data:", filteredData);

    await updateDatabase(filteredData);
  } catch (error) {
    console.error("Error in fetching posts:", error);
  }
}

setInterval(async () => {
  await main();
}, 30000);

app.use(express.json());
app.use("/stats", statsRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

main();
