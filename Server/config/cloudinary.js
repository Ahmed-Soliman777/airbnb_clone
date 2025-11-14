import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (filePath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error("File does not exist: " + filePath);
    }
    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "airbnb_clone",
    });

    // Remove file from local uploads folder after successful upload to Cloudinary
    fs.unlinkSync(filePath);
    return result;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};
