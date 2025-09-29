import { s3 } from "../config/s3Config";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { bucketName } from "../config/s3Config";
import { CustomError } from "../error/CustomError";
import { HttpStatus } from "../config/HttpStatusCodes";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import crypto from "crypto";

const generateUniqueNameForFile = (fileName: string) =>
  `${Date.now()}_${crypto.randomBytes(16).toString("hex")}_${fileName}`;


export async function uploadFileToS3(file: Express.Multer.File) {
  const { buffer: Body, mimetype: ContentType, originalname: fileName } = file;
  try {
    const Key = generateUniqueNameForFile(fileName);
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key,
      Body,
      ContentType,
    });
    await s3.send(command);
    return Key;
  } catch (error) {
    if (error instanceof Error) {
      throw new CustomError(error.message, HttpStatus.BAD_REQUEST);
    } else {
      throw new CustomError(
        "UnExpected Error Occured While uploading File to S3",
        HttpStatus.BAD_REQUEST
      );
    }
  }
}

export async function generateSignedUrl(
  key: string|null,
  expiresIn: number = 60 * 5
): Promise<string | null> {
  if (!key) {
    return null;
  }
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return await getSignedUrl(s3, command, { expiresIn });
}
