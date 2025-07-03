import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { CustomError } from "../error/CustomError";
import { HttpStatus } from "../config/HttpStatusCodes";
import {config} from "dotenv";
config({path: "./src"});
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export const uploadOnCloudinary = async (
  localFilePath: string,
  type:"auto"|"raw"="auto"
): Promise<string> => {
  try {
    if (!localFilePath) {
      throw new CustomError("File path is required", HttpStatus.BAD_REQUEST);
    }

    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: type,
    });

    if (!result || !result.secure_url) {
      throw new CustomError(
        "Cloudinary upload failed",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    throw new CustomError(
      "Failed to upload file to Cloudinary",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};
