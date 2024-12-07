import express from "express";
import { disasterPostsCollection } from "../connection/dbConnection.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const disasterPosts = await disasterPostsCollection
      .find({}, { projection: { embedding: 0 } })
      .toArray();

    res.status(200).json(disasterPosts);
  } catch (error) {
    console.error("Error fetching disaster posts:", error);
    res.status(500).json({ error: "Failed to fetch disaster posts" });
  }
});

export default router;
