import { PutObjectCommand } from "@aws-sdk/client-s3";
import r2Client from "./r2Client.js";
import dotenv from "dotenv";
dotenv.config();

export const uploadToR2 = async (fileName, fileBuffer, contentType) => {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await r2Client.send(command);

  // Encode fileName to make URL safe
  const encodedFileName = encodeURIComponent(fileName);

  // Public URL
  return `https://files.premierhubrmc.com/${encodedFileName}`;
};
