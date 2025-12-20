const express = require("express");
const router = express.Router();

const auth = require("../middleware/userMiddleware");
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
router.post("/toggle/:listingId", auth, toggleListing);

// get which lists contain a listing
router.get(
  "/listing/:listingId",
  auth,

  getListsContainingListing
);

// get all wishlist collections
router.get("/collections", auth, getWishlists);

// get a specific wishlist collection by ID
router.get(
  "/collections/:collectionId",
  auth,

  getCollection
);

// create a new wishlist collection
router.post("/collections", auth, createWishlist);

// add listing to a wishlist collection
router.post(
  "/collections/:collectionId/listings/:listingId",
  auth,

  addToWishlist
);

// remove listing from a wishlist collection
router.delete(
  "/collections/:collectionId/listings/:listingId",
  auth,

  removeFromWishlist
);

// delete an entire wishlist collection
router.delete(
  "/collections/:collectionId",
  auth,

  deleteWishlistList
);

module.exports = router;
