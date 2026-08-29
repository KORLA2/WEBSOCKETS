// server/helpers/uploadToCloudinary.ts
import type { UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary";

export const uploadToCloudinary = (
  file: Express.Multer.File
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "chat-app/profile-images",
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Cloudinary upload failed"));
        resolve(result);
      }
    );

    stream.end(file.buffer);
  });
};