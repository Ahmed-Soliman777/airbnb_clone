const WishList = require("../models/wishlist.model");
const Listing = require("../models/Listing.model");

// Add / Toggle wishlist item
const toggleWishlist = async (req, res) => {
  try {
    const userId = req.user._id; //  from middleware
    const { listingId } = req.params;

    // check listing
    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    // check if already in wishlist
    const existing = await WishList.findOne({
      user: userId,
      listing: listingId,
    });

    if (existing) {
      await existing.deleteOne();
      return res.json({ message: "Removed from wishlist" });
    }

    const newWish = await WishList.create({ user: userId, listing: listingId });
    return res
      .status(201)
      .json({ message: "Added to wishlist", wishlist: newWish });
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ message: "Already in wishlist" });
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete wishlist item
const deleteWishlist = async (req, res) => {
  try {
    const userId = req.user._id; // from middleware
    const { listingId } = req.params;

    const deleted = await WishList.findOneAndDelete({
      user: userId,
      listing: listingId,
    });

    if (!deleted)
      return res.status(404).json({ message: "Wishlist item not found" });

    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get wishlist of the current user (guest)
const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id; // from middleware

    const wishlistItems = await WishList.find({ user: userId })
      .populate({
        path: "listing",
        select: "title pricePerNight images",
      })
      .sort({ createdAt: -1 });

    res.json({
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
      wishlist: wishlistItems.map((item) => item.listing),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get wishlist by any user (admin)
// const getWishlistByUser = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const wishlist = await WishList.find({ user: userId })
//       .populate({
//         path: "listing",
//         select: "title price images location",
//       })
//       .sort({ createdAt: -1 });

//     res.json({ wishlist });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

module.exports = {
  toggleWishlist,
  deleteWishlist,
  getWishlist,
};
