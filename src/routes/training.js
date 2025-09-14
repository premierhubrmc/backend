import express from "express"
import { addTraining, fetchTrainingById, fetchTrainings, removeTraining } from "../controllers/trainingController.js"
import upload, { uploadTrainingFiles } from "../utils/upload.js"

const trainingRoutes =express.Router()



trainingRoutes.post("/",uploadTrainingFiles, addTraining)
trainingRoutes.get("/", fetchTrainings)
trainingRoutes.get("/:id", fetchTrainingById)
trainingRoutes.delete("/:id", removeTraining)




export default trainingRoutes