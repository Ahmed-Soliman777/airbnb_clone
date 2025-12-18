const express = require("express");
const router = express.Router();

const auth = require("../middleware/userMiddleware");
const authorize = require("../middleware/authUser");
const {
  getWishlists,
  getCollection,
  toggleListing,
  createWishlist,
  addToWishlist,
  removeFromWishlist,
  deleteWishlistList,
  getListsContainingListing,
} = require("../controllers/wishlist.controller");

// toggle listing in wishlist
router.post("/toggle/:listingId", auth, authorize(["guest"]), toggleListing);

// get which lists contain a listing
router.get(
  "/listing/:listingId",
  auth,
  authorize(["guest"]),
  getListsContainingListing
);

// get all wishlist collections
router.get("/collections", auth, authorize(["guest"]), getWishlists);

// get a specific wishlist collection by ID
router.get(
  "/collections/:collectionId",
  auth,
  authorize(["guest"]),
  getCollection
);

// create a new wishlist collection
router.post("/collections", auth, authorize(["guest"]), createWishlist);

// add listing to a wishlist collection
router.post(
  "/collections/:collectionId/listings/:listingId",
  auth,
  authorize(["guest"]),
  addToWishlist
);

// remove listing from a wishlist collection
router.delete(
  "/collections/:collectionId/listings/:listingId",
  auth,
  authorize(["guest"]),
  removeFromWishlist
);

// delete an entire wishlist collection
router.delete(
  "/collections/:collectionId",
  auth,
  authorize(["guest"]),
  deleteWishlistList
);

module.exports = router;
