const express = require("express");
const router = express.Router();
const amenitiesController = require("../controllers/amenity.controller");
const auth = require("../middleware/userMiddleware");
const authorize = require("../middleware/authUser");

// Create amenity – admin only
router.post("/", auth, authorize(["admin"]), amenitiesController.createAmenity);

// Get all amenities
router.get("/", amenitiesController.getAmenities);

// Update amenity – admin only
router.put(
  "/:id",
  auth,
  authorize(["admin"]),
  amenitiesController.updateAmenity
);

// Delete amenity – admin only
router.delete(
  "/:id",
  auth,
  authorize(["admin"]),
  amenitiesController.deleteAmenity
);

module.exports = router;
