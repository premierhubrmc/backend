import express, { Router } from "express"
import { addEvent, fetchEvents, removeEvent } from "../controllers/eventController.js"

const eventRoutes = Router()

eventRoutes.post("/", addEvent)
eventRoutes.get("/", fetchEvents)
eventRoutes.get("/:id", fetchEvents)
eventRoutes.delete("/:id", removeEvent)


export default eventRoutes