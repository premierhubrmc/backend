import pool from "../config/db.js";


export const getUpcomingEvents = async () => {
  const [rows] = await pool.query(
    `SELECT 
       e.id, 
       e.event_date, 
       e.location, 
       type,
       program,
       status, 
       e.is_featured, 
       e.icon_key,         -- include icon key
       t.title, 
       t.pdf_url
     FROM upcoming_events e
     JOIN training_programs t ON e.training_id = t.id`
  );
  return rows;
};


// Get a single upcoming event by ID
export const getEventById = async (id) => {
  const [rows] = await pool.query(
    `SELECT 
       e.id, 
       e.event_date, 
       e.location,
       type,
       program,
       status, 
       e.is_featured, 
       t.title, 
       t.pdf_url
     FROM upcoming_events e
     JOIN training_programs t ON e.training_id = t.id
     WHERE e.id = ?`,
    [id]
  );

  // If no event found, return null
  if (rows.length === 0) return null;

  return rows[0];
};


export const createEvent = async ({ training_id, event_date, location,type, program, status, is_featured, icon_key }) => {
  const [result] = await pool.query(
    `INSERT INTO upcoming_events (training_id, event_date, location, type, program, status, is_featured, icon_key) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [training_id, event_date, location, type, program, status, is_featured, icon_key] // include icon_key here
  );

  return { 
    id: result.insertId, 
    training_id, 
    event_date, 
    location,
    type, 
    program, 
    status, 
    is_featured, 
    icon_key 
  };
};



// ✅ Delete event by ID
export const deleteEvent = async (id) => {
  const [result] = await pool.query("DELETE FROM upcoming_events WHERE id = ?", [id]);

  // result.affectedRows tells us if a row was deleted
  return result.affectedRows > 0;
};