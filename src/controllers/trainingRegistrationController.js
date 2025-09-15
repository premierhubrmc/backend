import {
  userTrainingRegistration,
  getAllRegistrations,
  getRegistrationById,
  updateRegistration,
  deleteRegistration,
} from "../models/trainingREgistrationModel.js";

// ✅ Create - Register for training
export const registerForTraining = async (req, res) => {
  try {
    const { user_name, email, phone, event_id } = req.body;

    if (!user_name || !email || !phone || !event_id) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const registration = await userTrainingRegistration(
      user_name,
      email,
      phone,
      event_id
    );

    return res.status(201).json({
      message: "Training registration successful",
      registration,
    });
  } catch (error) {
    console.error("Error in registerForTraining:", error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};

// ✅ Read - Get all registrations
export const fetchAllRegistrations = async (req, res) => {
  try {
    const registrations = await getAllRegistrations();
    return res.status(200).json(registrations);
  } catch (error) {
    console.error("Error in fetchAllRegistrations:", error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};

// ✅ Read - Get a single registration by ID
export const fetchRegistrationById = async (req, res) => {
  try {
    const { id } = req.params;
    const registration = await getRegistrationById(id);

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    return res.status(200).json(registration);
  } catch (error) {
    console.error("Error in fetchRegistrationById:", error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};

// ✅ Update - Update a registration
export const editRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_name, email, phone, event_id } = req.body;

    if (!user_name || !email || !phone || !event_id) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const updated = await updateRegistration(id, {
      user_name,
      email,
      phone,
      event_id,
    });

    if (!updated) {
      return res.status(404).json({ message: "Registration not found" });
    }

    return res.status(200).json({
      message: "Registration updated successfully",
      updated,
    });
  } catch (error) {
    console.error("Error in editRegistration:", error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};

// ✅ Delete - Delete a registration
export const removeRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await deleteRegistration(id);

    if (!deleted) {
      return res.status(404).json({ message: "Registration not found" });
    }

    return res.status(200).json({ message: "Registration deleted successfully" });
  } catch (error) {
    console.error("Error in removeRegistration:", error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};
