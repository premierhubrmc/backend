import dotenv from "dotenv";
import app from "./src/app.js";
import pool from "./src/config/db.js"; // adjust path if different

dotenv.config();

const PORT = process.env.PORT || 8000;

(async () => {
  try {
    // Check DB before starting server
    const conn = await pool.getConnection();
    conn.release();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Backend running on port ${PORT} and accessible externally`);
    });
  } catch (err) {
    console.error("❌ Cannot start server. Database not connected:", err.message);
    process.exit(1);
  }
})();
