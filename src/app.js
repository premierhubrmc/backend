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

// ✅ Define allowed origins (strings + regex)
const allowedOrigins = [
  "http://localhost:5173",
  "https://premierhubrmc.com",
  "https://api.premierhubrmc.com",
  /\.ngrok-free\.app$/,  // regex for ngrok tunnels
];

// ✅ Use function-based origin check
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow mobile apps / curl / Postman

      if (
        allowedOrigins.some((o) =>
          typeof o === "string" ? o === origin : o.test(origin)
        )
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

// ----------------------------------------------------
// Routes
// ----------------------------------------------------
app.use("/api", userRoutes);
app.use("/api/trainings", trainingRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/training/registration", trainingRegistrationRoute);

// DB status route
app.get("/api/db-status", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS now");
    res.json({ status: "ok", dbTime: rows[0].now });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

export default app;
