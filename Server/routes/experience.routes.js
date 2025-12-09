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

// Public routes
router.get("/", getExperiences);
router.get("/:id", getExperience);

// Protected routes (require authentication)
router.post("/", auth, createExperience);
router.put("/:id", auth, updateExperience);
router.delete("/:id", auth, deleteExperience);
router.get("/host/my-experiences", auth, getHostExperiences);

module.exports = router;
