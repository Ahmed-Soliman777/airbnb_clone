const Listing = require("../models/Listing.model");
const Amenities = require("../models/Amenities.model");
// Create new listing
const createListing = async (req, res) => {
  try {
    const hostId = req.user.id;

    // Extract fields from request body
    const {
      title,
      pricePerNight,
      maxGuests,
      propertyType,
      amenities,
      caption,
      images,
      description,
    } = req.body;

    // Basic validation
    if (!title || !pricePerNight || !maxGuests || !propertyType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate amenities
    let validAmenities = [];
    if (Array.isArray(amenities) && amenities.length > 0) {
      validAmenities = await Amenities.find({
        _id: { $in: amenities },
      });
    }

    // Create listing
    const newListing = new Listing({
      title,
      pricePerNight,
      maxGuests,
      propertyType,
      hostId,
      description,
      amenities: validAmenities.map((a) => a._id),
    });

    // Handle images
    const uploadedImages = [];

    for (const file of req.files) {
      const result = await uploadOnCloudinary(file.path);
      uploadedImages.push({
        url: result.secure_url,
        caption: req.body.caption || "Listing photo",
      });
    }

    newListing.images = uploadedImages;

    // Save
    await newListing.save();

    return res.status(201).json(newListing);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all listings
const getListings = async (req, res) => {
  try {
    const listings = await Listing.find({})
      .populate("hostId", "firstName lastName _id") // join user info
      .populate("amenities", "name") // join amenities
      .populate("reviews", "rating comment"); // join reviews

    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single listing by ID
const getListingById = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id)
      .populate("hostId", "name email")
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
const updateListing = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    //check if he is the host of the listing not guest [authentication]
    if (listing.hostId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this listing" });
    }

    // Update the listing
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
const deleteListing = async (req, res) => {
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
        .json({ message: "Not authorized to delete this listing" });
    }

    await Listing.findByIdAndDelete(id);

    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search listings
const searchListings = async (req, res) => {
  // Extract query parameters and validate them if they are valid
  const {
    address,
    startDate = null,
    endDate = null,
    maxGuests,
    pricePerNight,
    maxPrice,
    propertyType,
    maxBedrooms,
    maxBathrooms,
    sortBy,
  } = req.query;

  // Validate data types and ranges
  if (maxGuests && isNaN(parseInt(maxGuests))) {
    return res.status(400).json({ message: "Invalid guests parameter" });
  }

  if (pricePerNight && isNaN(parseInt(pricePerNight))) {
    return res.status(400).json({ message: "Invalid pricePerNight parameter" });
  }

  if (maxPrice && isNaN(parseInt(maxPrice))) {
    return res.status(400).json({ message: "Invalid maxPrice parameter" });
  }

  if (maxBedrooms && isNaN(parseInt(maxBedrooms))) {
    return res.status(400).json({ message: "Invalid maxBedrooms parameter" });
  }

  if (
    pricePerNight &&
    maxPrice &&
    parseInt(pricePerNight) > parseInt(maxPrice)
  ) {
    return res.status(400).json({
      message: "pricePerNight must be less than or equal to maxPrice",
    });
  }

  // Build MongoDB Query Object
  const query = {};
  if (address) query.address = address;
  if (startDate && endDate) {
    query.available_dates = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }
  if (pricePerNight) query.price = { $gte: parseInt(pricePerNight) };
  if (maxPrice) query.price = { ...query.price, $lte: parseInt(maxPrice) };
  if (propertyType) query.propertyType = propertyType;
  if (maxBedrooms) query.bedrooms = { $gte: parseInt(maxBedrooms) };

  let sortOptions = {};
  if (sortBy === "price_asc") sortOptions.price = 1;
  else if (sortBy === "price_desc") sortOptions.price = -1;

  const listings = await Listing.find(query).sort(sortOptions).exec();
  res.status(200).json({ items: listings });
};

module.exports = {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing,
  searchListings,
};
