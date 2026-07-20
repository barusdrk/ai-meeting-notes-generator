import "dotenv/config";

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import summarizeRoutes from "./routes/summarize.js";
import uploadRoutes from "./routes/upload.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow tools like Postman and server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`Origin ${origin} is not allowed by CORS`)
      );
    },
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (_, res) => {
  res.json({
    name: "AI Meeting Notes Generator API",
    status: "running",
  });
});

app.get("/api/health", (_, res) => {
  res.json({
    status: "ok",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/summarize", summarizeRoutes);
app.use("/api/upload", uploadRoutes);

const PORT = Number(process.env.PORT) || 3001;

async function start() {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error(
        "MONGODB_URI environment variable is missing."
      );
    }

    await mongoose.connect(mongoUri);

    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:");
    console.error(error);
    process.exit(1);
  }
}

start();
