import dotenv from "dotenv";
import app from "./src/app.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

// ✅ Listen on all network interfaces (not just localhost)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on port ${PORT} and accessible externally`);
});
