import express from "express";
import http from "http";
import cors from "cors"; 
import { connectDB } from "./src/connection/dbConnection.js";
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

await connectDB();

async function main() {
  try {
    const posts = await fetchAllPosts();
    const filteredData = await filterData(posts);

    await updateDatabase(filteredData);
  } catch (error) {
    console.error("Error in fetching posts:", error);
  }
}

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  await main();

  setInterval(async () => {
    await main();
  }, 15000);
});

app.use(express.json());
app.use("/stats", statsRoute);
