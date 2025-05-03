import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { CustomError } from "../error/CustomError";
import { HttpStatus } from "../config/HttpStatusCodes";

cloudinary.config({
  cloud_name: "dhbwlpe6i",
  api_key: "837782626763286",
  api_secret: "-Nkm3c9Vb6Hzy-L7q-ksX3rosPM",
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
