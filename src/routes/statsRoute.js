import express from "express";
import { clientDb } from "../connection/dbConnection.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = clientDb.db();
    const collection = db.collection("disasterPosts");

    // Fetch all posts, excluding the "embedding" field
    const disasterPosts = await collection
      .find({}, { projection: { embedding: 0 } })
      .toArray();

    res.status(200).json(disasterPosts);
  } catch (error) {
    console.error("Error fetching disaster posts:", error);
    res.status(500).json({ error: "Failed to fetch disaster posts" });
  }
});

export default router;
