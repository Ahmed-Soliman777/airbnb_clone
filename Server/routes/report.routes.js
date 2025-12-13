const express = require("express");
const router = express.Router();
const {
  createReport,
  getUserReports,
  getListingReports,
  getAllReports,
  updateReportStatus,
  deleteReport,
  getReportStats,
} = require("../controllers/report.controller");
const authUser = require("../middleware/authUser");
const { isAdmin } = require("../middleware/userMiddleware");

// User routes
router.post("/", authUser, createReport);
router.get("/user", authUser, getUserReports);

// Admin routes
router.get("/", authUser, isAdmin, getAllReports);
router.get("/stats", authUser, isAdmin, getReportStats);
router.get("/listing/:listingId", authUser, isAdmin, getListingReports);
router.patch("/:reportId", authUser, isAdmin, updateReportStatus);
router.delete("/:reportId", authUser, isAdmin, deleteReport);

module.exports = router;
