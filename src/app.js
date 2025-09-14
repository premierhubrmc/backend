import express from "express"
import dotenv from "dotenv"
import userRoutes from "./routes/users.js"
import trainingRoutes from "./routes/training.js"
import eventRoutes from "./routes/event.js"

import cors from "cors"



dotenv.config()




const app = express()

app.use(express.json());


// Allow requests from your Vite frontend
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use("/api", userRoutes)
app.use("/api/trainings", trainingRoutes)
app.use("/api/events", eventRoutes)

export default app

