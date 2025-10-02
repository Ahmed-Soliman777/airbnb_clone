import express from "express";
import {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing,
} from "../controllers/listingController.js";
import { protect } from "../middleware/authMiddleware.js"; // auth middleware

const router = express.Router();

import { authenticateUser } from "../middleware/authMiddleware.js";

// Public routes
router.get("/", getListings);
router.get("/:id", getListingById);

// Protected routes (require login)
router.post("/", authenticateUser, createListing);
router.put("/:id", authenticateUser, updateListing);
router.delete("/:id", authenticateUser, deleteListing);

export default router;
