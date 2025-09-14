import { createTraining, deleteTraining, getAllTrainings, getTrainingById } from "../models/trainingModel.js";
import pool from "../config/db.js";
import { uploadToR2 } from "../utils/r2Helpers.js";


// Fetch all training programs
export const fetchTrainings = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, title, description, pdf_url, image_url FROM training_programs");

    // Since we already store public URLs in pdf_url, we can return them directly
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Failed to fetch trainings" });
  }
};

// Fetch a single training by ID
export const fetchTrainingById = async (req, res) => {
  try {
    const { id } = req.params;
    const training = await getTrainingById(id);

    if (!training) {
      return res.status(404).json({ message: `Training with id ${id} not found` });
    }

    res.status(200).json(training);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch training" });
  }
};

// Create a new training program with PDF upload
export const addTraining = async (req, res) => {
  try {
    console.log("REQ.BODY:", req.body);   // { title, description }
    console.log("REQ.FILES:", req.files); // { pdf: [..], image: [..] }

    const { title, description } = req.body;

    // Ensure both PDF and Image are uploaded
    if (!req.files || !req.files.pdf || !req.files.image) {
      return res
        .status(400)
        .json({ message: "Both PDF and Image files are required" });
    }

    // Extract files
    const pdfFile = req.files.pdf[0];
    const imageFile = req.files.image[0];

    // Generate unique names
    const pdfFileName = `${Date.now()}_${pdfFile.originalname}`;
    const imageFileName = `${Date.now()}_${imageFile.originalname}`;

    // Upload both to Cloudflare R2 (or Wasabi later)
    const pdfUrl = await uploadToR2(pdfFileName, pdfFile.buffer, pdfFile.mimetype);
    const imageUrl = await uploadToR2(imageFileName, imageFile.buffer, imageFile.mimetype);

    // Save training info in MySQL
    const [result] = await pool.query(
      "INSERT INTO training_programs (title, description, pdf_url, image_url) VALUES (?, ?, ?, ?)",
      [title, description, pdfUrl, imageUrl]
    );

    res.status(201).json({
      id: result.insertId,
      title,
      description,
      pdf_url: pdfUrl,
      image_url: imageUrl,
    });
  } catch (error) {
    console.error("ADD TRAINING ERROR:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to create training" });
  }
};





// Delete a training by ID
export const removeTraining = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteTraining(id);
    res.status(200).json({ message: `Training with id ${id} deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Failed to delete training" });
  }
};