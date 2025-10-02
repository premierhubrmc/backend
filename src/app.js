import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import userRoutes from "./routes/users.js";
import trainingRoutes from "./routes/training.js";
import eventRoutes from "./routes/event.js";
import trainingRegistrationRoute from "./routes/trainingRegistration.js";

import pool from "./config/db.js"; // <-- your MySQL pool

dotenv.config();

const app = express();

// Parse JSON
app.use(express.json());

// ✅ Define CORS options
const corsOptions = {
  origin: [
    "http://localhost:5173",
    /\.ngrok-free\.app$/,          // allow ngrok tunnels
    "https://premierhubrmc.com",   // production frontend
    "https://api.premierhubrmc.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

// ✅ Apply CORS globally
app.use(cors(corsOptions));

// ----------------------------------------------------
// Routes
// ----------------------------------------------------
app.use("/api", userRoutes);
app.use("/api/trainings", trainingRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/training/registration", trainingRegistrationRoute);

// ✅ DB status check route
app.get("/api/db-status", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS now");
    res.json({ status: "ok", dbTime: rows[0].now });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

export default app;
