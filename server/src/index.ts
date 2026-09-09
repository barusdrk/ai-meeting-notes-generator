import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import aiRoutes from "./routes/ai.js";
import uploadRoutes from "./routes/upload.js";
import summarizeRoutes from "./routes/summarize.js";
import meetingsRoutes from "./routes/meetings.js";
import tasksRoutes from "./routes/tasks.js";
import remindersRoutes from "./routes/reminders.js";
import analyticsRoutes from "./routes/analytics.js";
import reportsRoutes from "./routes/reports.js";
import billingRoutes from "./routes/billing.js";
import webhookRoutes from "./routes/webhooks.js";
import integrationsRoutes from "./routes/integrations.js";
import connectedAccountsRoutes from "./routes/connectedAccounts.js";

import "./jobs/transcriptionWorker.js";
import "./jobs/emailWorker.js";
import "./jobs/reminderWorker.js";
import "./jobs/analyticsWorker.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter((origin): origin is string => Boolean(origin));

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use("/api/webhooks", express.raw({ type: "application/json" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/summarize", summarizeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/meetings", meetingsRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/reminders", remindersRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/integrations", integrationsRoutes);
app.use("/api/connected-accounts", connectedAccountsRoutes);

app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "AI Meeting Notes Generator API",
    version: "1.0.0",
  });
});

const PORT = Number(process.env.PORT) || 3001;

async function start() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI is not configured.");
    }

    await mongoose.connect(mongoUri);
    console.log("MongoDB connected.");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Startup failed:", error);
    process.exit(1);
  }
}

start();
