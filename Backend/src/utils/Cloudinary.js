import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getResourceType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".webp"].includes(ext)) {
    return "image";
  } else if ([".mp4", ".avi", ".mov", ".mkv", ".webm", ".flv"].includes(ext)) {
    return "video";
  }
  return "auto";
};

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const resourceType = getResourceType(localFilePath);
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: resourceType,
      chunk_size: resourceType === "video" ? 6000000 : undefined,
    });
    if (response && response.url) {
      console.log(`File uploaded successfully as ${resourceType}:`, response.url);
      return response;
    } else {
      throw new Error("Cloudinary upload response is invalid");
    }
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error.message);
    return null;
  } finally {
    try {
      fs.unlinkSync(localFilePath);
    } catch (cleanupError) {
      console.error("Error deleting local file:", cleanupError.message);
    }
  }
};

export { uploadOnCloudinary };
