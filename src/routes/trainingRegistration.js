import express from "express";
import {
  registerForTraining,
  fetchAllRegistrations,
  fetchRegistrationById,
  editRegistration,
  removeRegistration,
} from "../controllers/trainingRegistrationController.js";

const trainingRegistrationRoute = express.Router();

// ✅ Create
trainingRegistrationRoute.post("/", registerForTraining);

// ✅ Read
trainingRegistrationRoute.get("/", fetchAllRegistrations);
trainingRegistrationRoute.get("/:id", fetchRegistrationById);

// ✅ Update
trainingRegistrationRoute.put("/:id", editRegistration);

// ✅ Delete
trainingRegistrationRoute.delete("/:id", removeRegistration);

export default trainingRegistrationRoute;
