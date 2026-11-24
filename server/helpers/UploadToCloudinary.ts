// server/helpers/uploadToCloudinary.ts
import type { UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary";

export const uploadToCloudinary = (
  file: Express.Multer.File,
  type
): Promise<UploadApiResponse> => {


  let  resource_type;

if (type.startsWith("image/")) {
  resource_type = "image";
} else if (
  type.startsWith("video/") ||
  type.startsWith("audio/")
) {
  resource_type = "video";
}
else{
  resource_type='raw'
}
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "chat-app/profile-images",
        resource_type,
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