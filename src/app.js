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
app.use(express.json());

// ✅ Dynamic CORS: allows ngrok automatically
const allowedOrigins = [
  "http://localhost:5173",
  "https://premierhubrmc.com",   // production frontend
  "https://api.premierhubrmc.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||                                      // allow server-to-server / curl
        allowedOrigins.includes(origin) ||              // exact match
        /\.ngrok-free\.app$/.test(origin)               // ✅ any ngrok tunnel
      ) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Register routes
app.use("/api", userRoutes);
app.use("/api/trainings", trainingRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/training/registration", trainingRegistrationRoute);

// ✅ Add DB status check route
app.get("/api/db-status", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS now");
    res.json({ status: "ok", dbTime: rows[0].now });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

export default app;
