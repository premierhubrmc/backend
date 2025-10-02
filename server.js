import dotenv from "dotenv";
import fs from "fs";
import http from "http";
import https from "https";
import app from "./src/app.js";
import pool from "./src/config/db.js";

dotenv.config();

const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV || "development";

(async () => {
  try {
    // Test DB connection first
    const conn = await pool.getConnection();
    conn.release();
    console.log("✅ Database connected successfully!");

    if (NODE_ENV === "production") {
      // 🔐 Use SSL certs on Vultr
     const options = {
  key: fs.readFileSync("/home/linuxuser/certs/privkey.pem"),
  cert: fs.readFileSync("/home/linuxuser/certs/fullchain.pem"),
};

      https.createServer(options, app).listen(443, "0.0.0.0", () => {
        console.log("🚀 HTTPS server running on port 443");
      });
    } else {
      // 🟢 Local dev (no SSL)
      http.createServer(app).listen(PORT, "0.0.0.0", () => {
        console.log(`🚀 HTTP server running on http://localhost:${PORT}`);
      });
    }
  } catch (err) {
    console.error("❌ Cannot start server. Database not connected:", err.message);
    process.exit(1);
  }
})();
