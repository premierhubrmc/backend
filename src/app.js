import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import userRoutes from "./routes/users.js";
import trainingRoutes from "./routes/training.js";
import eventRoutes from "./routes/event.js";
import trainingRegistrationRoute from "./routes/trainingRegistration.js";

import pool from "./config/db.js";

dotenv.config();

const app = express();
app.use(express.json());

// 🌍 Allowed domains
const baseDomain = "premierhubrmc.com";
const allowedOrigins = [
  "https://front-end-9gvu.vercel.app",
  `https://${baseDomain}`,
  `http://${baseDomain}`,
  `https://www.${baseDomain}`,
  `http://www.${baseDomain}`,
];

// 🔐 CORS setup
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server or Postman (no origin header)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("❌ Blocked CORS request from:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin", "Content-Type", "Authorization"],
  })
);

// ⚡ (Optional) Explicit preflight support for all routes
// Express v5 requires regex instead of "*"
app.options(/.*/, cors());

// 📌 API Routes
app.use("/api", userRoutes);
app.use("/api/trainings", trainingRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/training/registration", trainingRegistrationRoute);

// 🩺 Health check endpoint
app.get("/api/db-status", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS now");
    res.json({ status: "ok", dbTime: rows[0].now });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

export default app;
