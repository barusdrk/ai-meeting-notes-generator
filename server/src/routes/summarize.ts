import { Router } from "express";

import auth from "../middleware/auth.js";

import {
  summarizeTranscript,
} from "../services/ai.js";

const router = Router();

router.post(
  "/",
  auth,
  async (req, res) => {
    try {
      const { transcript } = req.body;

      if (
        typeof transcript !== "string" ||
        transcript.trim() === ""
      ) {
        return res.status(400).json({
          error: "Transcript is required.",
        });
      }

      const notes =
        await summarizeTranscript(
          transcript
        );

      return res.json(notes);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error:
          "Failed to summarize transcript.",
      });
    }
  }
);

export default router;
