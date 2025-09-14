import pool from "../config/db.js";



export const getAllTrainings = async () => {
  const [rows] = await pool.query("SELECT * FROM training_programs");
  return rows;
};

// Get a single training by ID
export const getTrainingById = async (id) => {
  const [rows] = await pool.query(
    "SELECT * FROM training_programs WHERE id = ?",
    [id]
  );

  // If no training found, return null
  if (rows.length === 0) return null;

  return rows[0];
};


export const createTraining = async ({ title, description, pdf_url, image_url }) => {
  const [result] = await pool.query(
    "INSERT INTO training_programs (title, description, pdf_url, image_url) VALUES (?, ?, ?, ?)",
    [title, description, pdf_url, image_url]
  );
  return { id: result.insertId, title, description, pdf_url, image_url };
};



// Delete a training by ID
export const deleteTraining = async (id) => {
  const [result] = await pool.query(
    "DELETE FROM training_programs WHERE id = ?",
    [id]
  );
  
  // Optional: check if any row was actually deleted
  if (result.affectedRows === 0) {
    throw new Error(`Training with id ${id} not found`);
  }

  return { message: `Training with id ${id} deleted successfully` };
};