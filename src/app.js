import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import userRoutes from "./routes/users.js";
import trainingRoutes from "./routes/training.js";
import eventRoutes from "./routes/event.js";
import trainingRegistrationRoute from "./routes/trainingRegistration.js";

import pool from "./config/db.js"; // MySQL pool

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// -------------------
// ✅ Robust CORS setup
// -------------------
const allowedOrigins = [
  "http://localhost:5173",
  /\.ngrok-free\.app$/,          // allow ngrok tunnels
  "https://premierhubrmc.com",   // production frontend
  "https://api.premierhubrmc.com"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman, curl, etc.

    const ok = allowedOrigins.some((o) => {
      if (typeof o === "string") return o === origin;
      if (o instanceof RegExp) return o.test(origin);
      return false;
    });

    if (ok) return callback(null, true);

    console.log("❌ Blocked by CORS:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  exposedHeaders: ["Content-Length"],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
// Handle preflight requests globally
app.options("*", cors(corsOptions));

// -------------------
// API routes
// -------------------
app.use("/api", userRoutes);
app.use("/api/trainings", trainingRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/training/registration", trainingRegistrationRoute);

// ✅ Database status check
app.get("/api/db-status", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS now");
    res.json({ status: "ok", dbTime: rows[0].now });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

export default app;
