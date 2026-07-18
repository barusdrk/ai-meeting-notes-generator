import "dotenv/config";

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import summarizeRoutes from "./routes/summarize.js";
import uploadRoutes from "./routes/upload.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/summarize", summarizeRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (_, res) => {
  res.json({
    message: "AI Meeting Notes Generator API",
  });
});

const PORT = Number(process.env.PORT) || 3001;

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(
        `🚀 Server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

start();
