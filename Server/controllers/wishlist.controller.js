// const WishList = require("../models/wishlist.model");
// const Listing = require("../models/Listing.model");

// // Add / Toggle wishlist item
// const toggleWishlist = async (req, res) => {
//   try {
//     const userId = req.user._id; //  from middleware
//     const { listingId } = req.params;

//     // check listing
//     const listing = await Listing.findById(listingId);
//     if (!listing) return res.status(404).json({ message: "Listing not found" });

//     // check if already in wishlist
//     const existing = await WishList.findOne({
//       user: userId,
//       listing: listingId,
//     });

//     if (existing) {
//       await existing.deleteOne();
//       return res.json({ message: "Removed from wishlist" });
//     }

//     const newWish = await WishList.create({ user: userId, listing: listingId });
//     return res
//       .status(201)
//       .json({ message: "Added to wishlist", wishlist: newWish });
//   } catch (err) {
//     if (err.code === 11000)
//       return res.status(409).json({ message: "Already in wishlist" });
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Delete wishlist item
// const deleteWishlist = async (req, res) => {
//   try {
//     const userId = req.user._id; // from middleware
//     const { listingId } = req.params;

//     const deleted = await WishList.findOneAndDelete({
//       user: userId,
//       listing: listingId,
//     });

//     if (!deleted)
//       return res.status(404).json({ message: "Wishlist item not found" });

//     res.json({ message: "Removed from wishlist" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Get wishlist of the current user (guest)
// const getWishlist = async (req, res) => {
//   try {
//     const userId = req.user._id; // from middleware

//     const wishlistItems = await WishList.find({ user: userId })
//       .populate({
//         path: "listing",
//         select:
//           "title description propertyType address pricePerNight cleaningFee maxGuests bedrooms bathrooms images amenities ratingAvg",
//       })
//       .sort({ createdAt: -1 });

//     res.json({
//       user: {
//         _id: req.user._id,
//         name: req.user.name,
//         email: req.user.email,
//         role: req.user.role,
//       },
//       wishlist: wishlistItems.map((item) => item.listing),
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Get wishlist by any user (admin)
// // const getWishlistByUser = async (req, res) => {
// //   try {
// //     const { userId } = req.params;

// //     const wishlist = await WishList.find({ user: userId })
// //       .populate({
// //         path: "listing",
// //         select: "title price images location",
// //       })
// //       .sort({ createdAt: -1 });

// //     res.json({ wishlist });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // };

// module.exports = {
//   toggleWishlist,
//   deleteWishlist,
//   getWishlist,
// };
/////////////////////////////

const WishlistCollection = require("../models/wishlist.model");
const Listing = require("../models/Listing.model");

// ==================== 1) جلب كل القوائم الخاصة باليوزر ====================
const getWishlists = async (req, res) => {
  try {
    // جيب ID اليوزر من الـ middleware (req.user)
    const userId = req.user._id;

    // ابحث عن كل القوائم اللي user = userId
    const collections = await WishlistCollection.find({ user: userId })
      // اجلب تفاصيل الـ listings (عنوان، صور، سعر، تقييم، عنوان)
      .populate({
        path: "listings",
        select: "title images pricePerNight ratingAvg address",
      })
      // رتبهم من الأحدث للأقدم
      .sort({ createdAt: -1 });

    // ارجع القوائم
    res.json({ collections });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== 2) جلب قائمة واحدة بالتفصيل ====================
const getCollection = async (req, res) => {
  try {
    const userId = req.user._id;
    const { collectionId } = req.params; // ID القائمة من الـ URL

    // ابحث عن القائمة اللي ID بتاعها = collectionId وتخص اليوزر ده
    const collection = await WishlistCollection.findOne({
      _id: collectionId,
      user: userId,
    }).populate({
      path: "listings",
      select: "title images pricePerNight ratingAvg address",
    });

    // لو مش موجودة
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    res.json({ collection });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== 3) Toggle Listing (أهم function!) ====================
const toggleListing = async (req, res) => {
  try {
    const userId = req.user._id;
    const { listingId } = req.params; // ID الـ listing من الـ URL

    // تأكد إن الـ listing موجود في الـ database
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // ابحث عن كل القوائم اللي فيها الـ listing ده
    const existingCollections = await WishlistCollection.find({
      user: userId, // تخص اليوزر ده
      listings: listingId, // وفيها الـ listing ده
    });

    // 🔴 لو الـ listing موجود في أي قائمة → شيله من كل القوائم
    if (existingCollections.length > 0) {
      // $pull بتشيل عنصر من array
      await WishlistCollection.updateMany(
        { user: userId }, // من كل قوائم اليوزر
        { $pull: { listings: listingId } } // اشل الـ listingId من مصفوفة listings
      );

      // ارجع response إن الـ listing اتشال
      return res.json({
        message: "Removed from wishlist",
        action: "removed", // ⭐ مهم: الفرونت هيستخدم ده
        isSaved: false,
      });
    }

    // 🟢 لو الـ listing مش موجود في أي قائمة
    // جيب كل القوائم الموجودة عشان نعرضها في الـ popup
    const allCollections = await WishlistCollection.find({
      user: userId,
    }).select("_id name"); // جيب ID والاسم بس

    // ارجع response إن محتاج يفتح popup
    return res.json({
      message: "Need to create or select collection",
      action: "needCollection", // ⭐ الفرونت هيفتح popup
      isSaved: false,
      collections: allCollections, // القوائم الموجودة (ممكن تكون فاضية [])
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== 4) إنشاء قائمة جديدة مع listing ====================
const createWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, listingId } = req.body; // الاسم والـ listing من الـ request body

    // تأكد إن اليوزر كتب اسم
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: "Collection name is required" });
    }

    // تأكد إن الـ listing موجود
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // اعمل القائمة الجديدة
    const collection = await WishlistCollection.create({
      user: userId,
      name: name.trim(), // امسح المسافات الزيادة
      listings: [listingId], // حط الـ listing في القائمة
    });

    // ارجع القائمة الجديدة
    res.status(201).json({
      message: "Collection created and listing added",
      collection,
      action: "added", // ⭐ الفرونت هيستخدم ده
      isSaved: true,
    });
  } catch (err) {
    // لو اليوزر حاول يعمل قائمة بنفس الاسم
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: "Collection with this name already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== 5) إضافة listing لقائمة موجودة ====================
const addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { collectionId, listingId } = req.params; // من الـ URL

    // تأكد إن الـ listing موجود
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // جيب القائمة وتأكد إنها تخص اليوزر ده
    const collection = await WishlistCollection.findOne({
      _id: collectionId,
      user: userId,
    });

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    // تأكد إن الـ listing مش موجود في القائمة already
    if (collection.listings.includes(listingId)) {
      return res
        .status(409)
        .json({ message: "Listing already in this collection" });
    }

    // أضف الـ listing للقائمة
    collection.listings.push(listingId);
    await collection.save(); // احفظ التغييرات

    // اجلب تفاصيل الـ listings
    await collection.populate({
      path: "listings",
      select: "title images pricePerNight ratingAvg address",
    });

    res.json({
      message: "Added to collection",
      collection,
      action: "added",
      isSaved: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== 6) حذف listing من قائمة ====================
const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { collectionId, listingId } = req.params;

    const collection = await WishlistCollection.findOne({
      _id: collectionId,
      user: userId,
    });

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    // اشل الـ listing من مصفوفة listings
    collection.listings = collection.listings.filter(
      (id) => id.toString() !== listingId
    );
    await collection.save();

    res.json({ message: "Removed from collection" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== 7) حذف قائمة كاملة ====================
const deleteWishlistList = async (req, res) => {
  try {
    const userId = req.user._id;
    const { collectionId } = req.params;

    const collection = await WishlistCollection.findOne({
      _id: collectionId,
      user: userId,
    });

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    // احذف القائمة
    await collection.deleteOne();
    res.json({ message: "Collection deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== 8) اعرف الـ listing موجود في أنهي قوائم ====================
const getListsContainingListing = async (req, res) => {
  try {
    const userId = req.user._id;
    const { listingId } = req.params;

    // ابحث عن كل القوائم اللي فيها الـ listing ده
    const collections = await WishlistCollection.find({
      user: userId,
      listings: listingId,
    }).select("_id name");

    res.json({
      isSaved: collections.length > 0, // true لو موجود، false لو مش موجود
      collections, // القوائم اللي فيها الـ listing
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// تصدير كل الـ functions
module.exports = {
  getWishlists,
  getCollection,
  toggleListing,
  createWishlist,
  addToWishlist,
  removeFromWishlist,
  deleteWishlistList,
  getListsContainingListing,
};
