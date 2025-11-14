import multer from "multer";

// Set up multer storage configuration tio save files to './public/uploads/' directory
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

//create upload middleware using multer
// Initialize multer with the defined storage configuration
let upload = multer({ storage: storage });

export default upload;
