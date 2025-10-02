import Listing from "../models/listing.js";

// Create new listing
export const createListing = async (req, res) => {
  try {
    const hostId = req.user.id;

    const { title, pricePerNight, maxGuests, propertyType } = req.body;

    // Validation
    if (!title || !pricePerNight || !maxGuests || !propertyType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newListing = new Listing({
      ...req.body,
      host: hostId,
    });

    await newListing.save();
    res.status(201).json(newListing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all listings
export const getListings = async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate("host", "name email") // يجيب بيانات من جدول المستخدم
      .populate("amenities", "name") // يجيب أسماء الـ amenities
      .populate("reviews"); // يجيب المراجعات

    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single listing by ID
export const getListingById = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id)
      .populate("host", "name email")
      .populate("amenities", "name")
      .populate("reviews");

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update listing
export const updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const hostId = req.user.id;

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.host.toString() !== hostId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this listing" });
    }

    const updatedListing = await Listing.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedListing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete listing
export const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    const hostId = req.user.id; // Authenticated user (host)

    // Check if listing exists
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Check if the authenticated user is the owner
    if (listing.host.toString() !== hostId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this listing" });
    }

    // Delete listing
    await Listing.findByIdAndDelete(id);

    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
