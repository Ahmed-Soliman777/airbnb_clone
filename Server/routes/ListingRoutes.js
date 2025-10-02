const express = require("express");
const {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing,
} = require("../controllers/Listing.controller.js");

const protect = require("../middleware/userMiddleware.js");
const authenticateUser = require("../middleware/authUser.js");

const router = express.Router();

// Public routes
router.get("/listings", getListings);
router.get("/listings/:id", getListingById);

// Protected routes (require login + role check)
router.post("/listings", protect, authenticateUser(["host", "admin"]), createListing);
router.put("/listings/:id", protect, authenticateUser(["host", "admin"]), updateListing);
router.delete("/listings/:id", protect, authenticateUser(["host", "admin"]), deleteListing);

module.exports = router;
