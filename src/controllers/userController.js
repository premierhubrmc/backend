import { createUser, getAllUsers, getUserByEmail } from "../models/userModel.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";

export const addUser = async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Login user

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 2. Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 3. Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role }, // payload
      process.env.JWT_SECRET,          // secret key
      { expiresIn: "1h" }              // token expiry
    );

    // 4. Send response with token + basic user info
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all users (admin)
export const fetchUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
