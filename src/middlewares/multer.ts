import { Request } from "express";
import multer, { diskStorage } from "multer";

// Define storage configuration
const storage = diskStorage({})


const limits = {
  fileSize: 5 * 1024 * 1024, // 5 MB limit for file size
};


export const uploader = multer({ storage, limits });
