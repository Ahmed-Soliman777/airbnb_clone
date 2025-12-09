// const express = require("express");
// const router = express.Router();

// const auth = require("../middleware/userMiddleware");
// const authorize = require("../middleware/authUser");
// const {
//   getWishlist,
//   toggleWishlist,
//   deleteWishlist,
// } = require("../controllers/wishlist.controller");

// // Guest adds/removes a favorite for themselves
// router.post("/:listingId", auth, authorize(["guest"]), toggleWishlist);

// router.delete("/:listingId", auth, authorize(["guest"]), deleteWishlist);

// // Guest views their own wishlist
// router.get("/", auth, authorize(["guest"]), getWishlist);

// // // Admin views wishlist of any user by userId
// // router.get("/user/:userId", auth, authorize(["admin"]), getWishlistByUser);
// module.exports = router;

const express = require("express");
const router = express.Router();

// Middleware للتحقق من الـ authentication
const auth = require("../middleware/userMiddleware");
const authorize = require("../middleware/authUser");

// استيراد الـ controller functions
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

// ⭐ أهم route: Toggle (أول مرة يضيف، تاني مرة يشيل)
// POST /api/wishlist/toggle/:listingId
router.post("/toggle/:listingId", auth, authorize(["guest"]), toggleListing);

// اعرف الـ listing موجود في أنهي قوائم (للـ heart icon)
// GET /api/wishlist/listing/:listingId
router.get(
  "/listing/:listingId",
  auth,
  authorize(["guest"]),
  getListsContainingListing
);

// جلب كل القوائم
// GET /api/wishlist/collections
router.get("/collections", auth, authorize(["guest"]), getWishlists);

// جلب قائمة واحدة
// GET /api/wishlist/collections/:collectionId
router.get(
  "/collections/:collectionId",
  auth,
  authorize(["guest"]),
  getCollection
);

// إنشاء قائمة جديدة (من الـ popup)
// POST /api/wishlist/collections
router.post("/collections", auth, authorize(["guest"]), createWishlist);

// إضافة listing لقائمة موجودة (من الـ popup)
// POST /api/wishlist/collections/:collectionId/listings/:listingId
router.post(
  "/collections/:collectionId/listings/:listingId",
  auth,
  authorize(["guest"]),
  addToWishlist
);

// حذف listing من قائمة
// POST /api/wishlist/collections/:collectionId/remove
router.post(
  "/collections/:collectionId/remove",
  auth,
  authorize(["guest"]),
  removeFromWishlist
);

// حذف قائمة كاملة
// DELETE /api/wishlist/collections/:collectionId
router.delete(
  "/collections/:collectionId",
  auth,
  authorize(["guest"]),
  deleteWishlistList
);

module.exports = router;
