import pool from "../config/db.js";

// ✅ Create - Register a user for a training event
export const userTrainingRegistration = async (user_name, email, phone, event_id) => {
  try {
    const [result] = await pool.query(
      `INSERT INTO training_registration (user_name, email, phone, event_id)
       VALUES (?, ?, ?, ?)`,
      [user_name, email, phone, event_id]
    );

    // Fetch the inserted record with training title
    const [rows] = await pool.query(
      `SELECT r.id, r.user_name, r.email, r.phone, r.event_id, p.title
       FROM training_registration r
       JOIN training_programs p ON r.event_id = p.id
       WHERE r.id = ?`,
      [result.insertId]
    );

    return rows[0]; // return full row with title
  } catch (error) {
    console.error("Error registering training:", error);
    throw error;
  }
};

// ✅ Read - Get all registrations
export const getAllRegistrations = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT r.id, r.user_name, r.email, r.phone, r.event_id, p.title
       FROM training_registration r
       JOIN training_programs p ON r.event_id = p.id
       ORDER BY r.created_at DESC`
    );
    return rows;
  } catch (error) {
    console.error("Error fetching registrations:", error);
    throw error;
  }
};

// ✅ Read - Get registration by ID
export const getRegistrationById = async (id) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.id, r.user_name, r.email, r.phone, r.event_id, p.title
       FROM training_registration r
       JOIN training_programs p ON r.event_id = p.id
       WHERE r.id = ?`,
      [id]
    );

    if (rows.length === 0) return null;
    return rows[0];
  } catch (error) {
    console.error("Error fetching registration by ID:", error);
    throw error;
  }
};

// ✅ Update - Update a registration
export const updateRegistration = async (id, { user_name, email, phone, event_id }) => {
  try {
    await pool.query(
      `UPDATE training_registration
       SET user_name = ?, email = ?, phone = ?, event_id = ?
       WHERE id = ?`,
      [user_name, email, phone, event_id, id]
    );

    // Return updated record
    return await getRegistrationById(id);
  } catch (error) {
    console.error("Error updating registration:", error);
    throw error;
  }
};

// ✅ Delete - Remove a registration
export const deleteRegistration = async (id) => {
  try {
    const [result] = await pool.query(
      `DELETE FROM training_registration WHERE id = ?`,
      [id]
    );

    return result.affectedRows > 0; // true if deleted
  } catch (error) {
    console.error("Error deleting registration:", error);
    throw error;
  }
};
