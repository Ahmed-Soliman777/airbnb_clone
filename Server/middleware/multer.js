import multer from "multer";
import fs from "fs";
import path from "path";

// Set upload folder path
const uploadPath = path.join(__dirname, "../public/uploads");

// Ensure the uploads folder exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Set up multer storage configuration to save files to './public/uploads/' directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Create upload middleware using multer
// Initialize multer with the defined storage configuration
const upload = multer({ storage: storage });

module.exports = upload;
