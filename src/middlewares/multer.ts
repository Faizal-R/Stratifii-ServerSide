import multer from "multer";

const storage = multer.memoryStorage();

const limits = {
  fileSize: 10 * 1024 * 1024, // 5 MB
};

export const uploader = multer({ storage, limits });
