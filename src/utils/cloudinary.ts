import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

const getCloudinaryCredentials = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  return { cloudName, apiKey, apiSecret };
};

/**
 * Uploads a file buffer directly to Cloudinary.
 * 
 * @param file Express.Multer.File object parsed by multer
 * @returns Secure Cloudinary URL
 */
export async function uploadToCloudinary(file: Express.Multer.File): Promise<string> {
  const { cloudName, apiKey, apiSecret } = getCloudinaryCredentials();

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary credentials (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are not configured on the backend server."
    );
  }

  // Configure Cloudinary on each request dynamically
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return new Promise((resolve, reject) => {
    // Generate clean public_id (remove extension and sanitize name)
    const originalNameWithoutExt = file.originalname.split(".").slice(0, -1).join(".");
    const cleanPublicId = originalNameWithoutExt.replace(/[^a-zA-Z0-9-_]/g, "_");

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "aayush-wellness",
        resource_type: "auto",
        public_id: cleanPublicId,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(new Error("No response payload received from Cloudinary."));
        }
        resolve(result.secure_url);
      }
    );

    // Stream the buffer into the Cloudinary upload API
    Readable.from(file.buffer).pipe(uploadStream);
  });
}
