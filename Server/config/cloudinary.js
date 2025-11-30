import { v2 as cloudinary } from "cloudinary";

const uploadOnCloudinary = async (base64String) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  try {
    // if (!fs.existsSync(base64String)) {
    //   throw new Error("File does not exist: " + base64String);
    // }
    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(base64String, {
      folder: "airbnb_clone",
    });

    // Remove file from local uploads folder after successful upload to Cloudinary
    // fs.unlinkSync(base64String);
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};

export { uploadOnCloudinary };