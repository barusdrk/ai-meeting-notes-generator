import { Router } from "express";
import multer from "multer";

import auth from "../middleware/auth";

import {
  extractText,
} from "../services/extractText";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.post(
  "/",
  auth,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "No file uploaded.",
        });
      }

      const transcript =
        await extractText(req.file);

      return res.json({
        transcript,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error:
          "Unable to process uploaded file.",
      });
    }
  }
);

export default router;
