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

// ✅ CORS handling in Express
const allowedOrigins = [
  "https://front-end-9gvu.vercel.app", 
  "https://premierhub.com", 
  "http://premierhub.com", 
  "https://www.premierhub.com",
  "http://www.premierhub.com",
  
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin", "Content-Type", "Authorization"],
  })
);

// ✅ Routes
app.use("/api", userRoutes);
app.use("/api/trainings", trainingRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/training/registration", trainingRegistrationRoute);

// ✅ Health check
app.get("/api/db-status", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS now");
    res.json({ status: "ok", dbTime: rows[0].now });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

export default app;
