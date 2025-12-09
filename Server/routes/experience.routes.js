const express = require("express");
const router = express.Router();
const {
  createExperience,
  getExperiences,
  getExperience,
  updateExperience,
  deleteExperience,
  getHostExperiences,
} = require("../controllers/experience.controller.js");
const auth = require("../middleware/userMiddleware.js");
const upload = require("../middleware/multer");

// Public routes
router.get("/", getExperiences);
router.get("/:id", getExperience);

// Protected routes (require authentication)
router.post("/", auth, upload.array("images", 10), createExperience);
router.put("/:id", auth, upload.array("images", 10), updateExperience);
router.delete("/:id", auth, deleteExperience);
router.get("/host/my-experiences", auth, getHostExperiences);

module.exports = router;
