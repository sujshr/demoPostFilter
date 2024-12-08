import express from "express";
import { clientReport } from "../connection/dbConnection.js";
import { quickReportSchema } from "../schemas/TrackReport.js"; // Assuming you've created a Zod schema

const router = express.Router();

// POST route to add a new quick report
router.post("/postReport", async (req, res) => {
  try {
    // Validate the incoming request body using the Zod schema
    const validatedData = quickReportSchema.parse(req.body);

    const db = clientReport.db();
    const collection = db.collection("DisasterReports");

    // Create a new quick report
    const newQuickReport = {
      disasterId: validatedData.disasterId,
      status: validatedData.status,
      comments: validatedData.comments,
      teamMessage: validatedData.teamMessage,
      createdAt: validatedData.createdAt,
    };

    // Insert the new quick report into the collection
    const result = await collection.insertOne(newQuickReport);

    res.status(201).json({
        message: "Quick report created successfully",
        quickReport: {
          ...newQuickReport,
          _id: result.insertedId,
        },
      });
  } catch (error) {
    console.error("Error creating quick report:", error);
    res.status(400).json({ error: "Failed to create quick report", details: error.errors });
  }
});

// GET route to fetch quick reports for a specific disasterId
router.get("/:disasterId", async (req, res) => {
  try {
    const { disasterId } = req.params;
    const db = clientReport.db();
    const collection = db.collection("DisasterReports");

    // Find quick reports that match the disasterId
    const quickReports = await collection
      .find({ disasterId })
      .toArray();

    if (quickReports.length === 0) {
      return res.status(404).json({ message: "No quick reports found for this disaster" });
    }

    res.status(200).json(quickReports);
  } catch (error) {
    console.error("Error fetching quick reports:", error);
    res.status(500).json({ error: "Failed to fetch quick reports" });
  }
});

export default router;
