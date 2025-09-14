import pool from "../config/db.js";
import bcrypt from "bcryptjs";


// 1. Create a new user
export const createUser =async ({ name, email, password, tel, role })=>{
    const hashedPassword = await bcrypt.hash(password, 10)
  const [result] = await pool.query(
    "INSERT INTO users (name, email, password, tel, role) VALUES (?, ?, ?, ?, ?)",
    [name, email, hashedPassword, tel, role]
  );
  return { id: result.insertId, name, email, tel, role }
}


// 2. Get user by email (for login)
export const getUserByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};

// 3. Get all users (for admin)
export const getAllUsers = async () => {
  const [rows] = await pool.query("SELECT id, name, email, tel, role FROM users");
  return rows;
};