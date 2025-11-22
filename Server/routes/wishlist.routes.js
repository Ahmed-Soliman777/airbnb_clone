const express = require("express");
const router = express.Router();

const auth = require("../middleware/userMiddleware");
const authorize = require("../middleware/authUser");
const {
  getWishlist,
  toggleWishlist,
  deleteWishlist,
} = require("../controllers/wishlist.controller");

// Guest adds/removes a favorite for themselves
router.post("/:listingId", auth, authorize(["guest"]), toggleWishlist);

router.delete("/:listingId", auth, authorize(["guest"]), deleteWishlist);

// Guest views their own wishlist
router.get("/", auth, authorize(["guest"]), getWishlist);

// // Admin views wishlist of any user by userId
// router.get("/user/:userId", auth, authorize(["admin"]), getWishlistByUser);
module.exports = router;
