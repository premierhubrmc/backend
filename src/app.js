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

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:5173",       // dev
  /\.ngrok-free\.app$/,          // any ngrok tunnel
  "https://premierhubrmc.com",   // production frontend
  "https://api.premierhubrmc.com"
];

// ✅ Dynamic CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow server-to-server requests

      const isAllowed = allowedOrigins.some((o) =>
        typeof o === "string" ? o === origin : o.test(origin)
      );

      if (isAllowed) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
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
