import express from "express";
import http from "http";
import cors from "cors";
import {
  connectDB,
  unfilteredPostsCollection,
} from "./src/connection/dbConnection.js";
import { fetchAllPosts } from "./src/fetchService/dataFetcher.js";
import { filterData } from "./src/filterService/dataFilter.js";
import { updateDatabase } from "./src/postService/dataPoster.js";
import statsRoute from "./src/routes/statsRoute.js";

import { initializeSocketIO } from "./src/socket/socketConfig.js";
import { setIO } from "./src/postService/dataPoster.js";

const app = express();
const server = http.createServer(app);
const io = initializeSocketIO(server);
setIO(io);

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/stats", statsRoute);

await connectDB();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  try {
    const posts = await fetchAllPosts();

    const filteredData = await filterData(posts);

    if (filteredData.length > 0) {
      const successfulPostIds = filteredData.map(
        (post) => post.originalPost._id
      );

      const result = await unfilteredPostsCollection.updateMany(
        { _id: { $in: successfulPostIds } },
        { $set: { filtered: true } }
      );

      console.log(`Marked ${result.modifiedCount} posts as filtered. \n`);
    } else {
      console.log("No posts were successfully transformed. \n");
    }

    await updateDatabase(filteredData);

    return true;
  } catch (error) {
    console.error("Error in main process:", error);
    return false;
  }
}

async function runMain() {
  let iteration = 0;

  while (true) {
    try {
      console.log(`Iteration: ${++iteration}`);
      const result = await main();

      if (!result) {
        console.log("Main process returned false. Stopping execution.");
        break;
      }

      await sleep(5000);
    } catch (error) {
      console.error("Error in runMain loop:", error);
    }
  }
}

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  await runMain();
});
