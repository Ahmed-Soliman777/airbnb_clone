const WishlistCollection = require("../models/wishlist.model");
const Listing = require("../models/Listing.model");

// get all wishlists for the logged-in user
const getWishlists = async (req, res) => {
  try {
    const userId = req.user._id;

    const collections = await WishlistCollection.find({ user: userId })
      .populate({
        path: "listings",
        select: "title images pricePerNight ratingAvg address",
      })
      .sort({ createdAt: -1 });

    res.json({ collections });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// get a specific wishlist collection by ID
const getCollection = async (req, res) => {
  try {
    const userId = req.user._id;
    const { collectionId } = req.params;

    const collection = await WishlistCollection.findOne({
      _id: collectionId,
      user: userId,
    }).populate({
      path: "listings",
      select:
        "title images pricePerNight ratingAvg address description bedrooms bathrooms maxGuests",
    });

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    res.json({ collection });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Toggle listing in wishlist
const toggleListing = async (req, res) => {
  try {
    const userId = req.user._id;
    const { listingId } = req.params;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const existingCollections = await WishlistCollection.find({
      user: userId,
      listings: listingId,
    });

    if (existingCollections.length > 0) {
      await WishlistCollection.updateMany(
        { user: userId },
        { $pull: { listings: listingId } }
      );

      return res.json({
        message: "Removed from wishlist",
        action: "removed",
        isSaved: false,
      });
    }

    const allCollections = await WishlistCollection.find({
      user: userId,
    })
      .populate({
        path: "listings",
        select: "title images pricePerNight ratingAvg address",
      })
      .sort({ createdAt: -1 });

    return res.json({
      message: "Need to create or select collection",
      action: "needCollection",
      isSaved: false,
      collections: allCollections,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//  create a new wishlist collection and add a listing to it
const createWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, listingId } = req.body; // name and listing from the request body

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: "Collection name is required" });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const collection = await WishlistCollection.create({
      user: userId,
      name: name.trim(),
      listings: [listingId],
    });

    res.status(201).json({
      message: "Collection created and listing added",
      collection,
      action: "added",
      isSaved: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
  // } catch (err) {
  //   if (err.code === 11000) {
  //     return res
  //       .status(409)
  //       .json({ message: "Collection with this name already exists" });
  //   }
  //   console.error(err);
  //   res.status(500).json({ message: "Server error" });
  // }
};

//  Add listing to an existing collection
const addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { collectionId, listingId } = req.params;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const collection = await WishlistCollection.findOne({
      _id: collectionId,
      user: userId,
    });

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    if (collection.listings.includes(listingId)) {
      return res
        .status(409)
        .json({ message: "Listing already in this collection" });
    }

    collection.listings.push(listingId);
    await collection.save();

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

//  Remove listing from a collection
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

    // Remove the listing from the listings array
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

// Delete an entire wishlist collection
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

    await collection.deleteOne();
    res.json({ message: "Collection deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Check which lists contain a listing
const getListsContainingListing = async (req, res) => {
  try {
    const userId = req.user._id;
    const { listingId } = req.params;

    // Search for all collections that contain this listing
    const collections = await WishlistCollection.find({
      user: userId,
      listings: listingId,
    }).select("_id name");

    res.json({
      isSaved: collections.length > 0,
      collections,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

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
