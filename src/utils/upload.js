import multer from "multer";

// Store files in memory as buffer (for Cloudflare R2 or Wasabi uploads)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// For single file upload (e.g., just one PDF)
export const uploadSingle = (fieldName) => upload.single(fieldName);

// For multiple files with different field names (PDF + Image)
export const uploadTrainingFiles = upload.fields([
  { name: "pdf", maxCount: 1 },
  { name: "image", maxCount: 1 },
]);

// For general use if needed (accept array of files for one field)
export const uploadArray = (fieldName, maxCount = 5) =>
  upload.array(fieldName, maxCount);

export default upload;
