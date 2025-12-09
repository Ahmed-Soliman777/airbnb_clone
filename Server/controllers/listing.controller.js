const Listing = require("../models/Listing.model");
const Amenities = require("../models/Amenities.model");
const { uploadOnCloudinary } = require("../config/cloudinary");
// Create new listing
const createListing = async (req, res) => {
  try {
    const hostId = req.user.id;

    // All fields are strings when sent via FormData
    const {
      title,
      description,
      propertyType,
      pricePerNight,
      maxGuests,
      cleaningFee,
      bedrooms,
      bathrooms,
      amenities,
      street,
      city,
      country,
      coordinates,
      availability,
      caption,
    } = req.body;

    // Required fields check (parse numbers)
    if (
      !title ||
      !description ||
      !propertyType ||
      !pricePerNight ||
      !maxGuests
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Convert string fields to correct types
    const parsedAmenities = amenities ? JSON.parse(amenities) : [];
    const parsedCoordinates = coordinates ? JSON.parse(coordinates) : {};
    const parsedAvailability = availability ? JSON.parse(availability) : [];

    const parsedPricePerNight = Number(pricePerNight);
    const parsedMaxGuests = Number(maxGuests);
    const parsedCleaningFee = cleaningFee ? Number(cleaningFee) : 0;
    const parsedBedrooms = bedrooms ? Number(bedrooms) : 1;
    const parsedBathrooms = bathrooms ? Number(bathrooms) : 1;

    // Validate amenities
    let validAmenities = [];
    if (parsedAmenities.length > 0) {
      validAmenities = await Amenities.find({
        _id: { $in: parsedAmenities },
      });
    }

    // Handle images
    const uploadedImages = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadOnCloudinary(file.path);
        uploadedImages.push({
          url: result.secure_url,
          caption: caption || "Listing photo",
        });
      }
    }

    // Format availability
    const formattedAvailability = parsedAvailability.map((range) => {
      if (Array.isArray(range)) {
        return { startDate: new Date(range[0]), endDate: new Date(range[1]) };
      }

      const date = new Date(range);
      return { startDate: date, endDate: date };
    });

    const newListing = new Listing({
      title,
      description,
      propertyType,
      pricePerNight: parsedPricePerNight,
      maxGuests: parsedMaxGuests,
      cleaningFee: parsedCleaningFee,
      bedrooms: parsedBedrooms,
      bathrooms: parsedBathrooms,
      amenities: validAmenities.map((a) => a._id),
      hostId,
      images: uploadedImages,
      address: { street, city, country, coordinates: parsedCoordinates },
      availability: formattedAvailability,
    });

    await newListing.save();
    return res.status(201).json(newListing);
  } catch (error) {
    console.error(error);
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
      .populate(
        "hostId",
        "firstName lastName profilePhoto email createdAt role listings"
      )
      .populate("amenities", "name")
      .populate("reviews");

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // -------------- this section is to calculate host stats --------------
    // Calculate host stats
    if (listing.hostId) {
      const hostListings = listing.hostId.listings || [];

      // Get all reviews for host's listings
      const Review = require("../models/Review.model");
      const hostReviews = await Review.find({
        listingId: { $in: hostListings },
      });

      // Calculate average rating and review count
      const totalReviews = hostReviews.length;
      const avgRating =
        totalReviews > 0
          ? (
              hostReviews.reduce((sum, review) => sum + review.rating, 0) /
              totalReviews
            ).toFixed(2)
          : 0;

      // Calculate years hosting
      const yearsHosting = Math.floor(
        (Date.now() - new Date(listing.hostId.createdAt)) /
          (365.25 * 24 * 60 * 60 * 1000)
      );

      // Add host stats to response
      listing._doc.hostStats = {
        totalReviews,
        avgRating: parseFloat(avgRating),
        yearsHosting,
        isSuperhost:
          listing.hostId.role === "host" || listing.hostId.role === "main-host",
      };
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
    location_search,
    date_picker_type,
    monthly_start_date,
    monthly_end_date,
    monthly_length,
    checkin,
    checkout,
    adults = 0,
    children = 0,
    infants = 0,
    pets = 0,
    min_price,
    max_price,
    property_type_id,
    room_types,
    min_bedrooms,
    min_bathrooms,
    amenities,
    sortBy,
    search_type,
    refinement_paths,
  } = req.query;

  // Calculate total guests
  const totalGuests =
    parseInt(adults || 0) + parseInt(children || 0) + parseInt(infants || 0);

  // Validate numeric parameters
  if (min_price && isNaN(parseInt(min_price))) {
    return res.status(400).json({ message: "Invalid min_price parameter" });
  }

  if (max_price && isNaN(parseInt(max_price))) {
    return res.status(400).json({ message: "Invalid max_price parameter" });
  }

  if (min_bedrooms && isNaN(parseInt(min_bedrooms))) {
    return res.status(400).json({ message: "Invalid min_bedrooms parameter" });
  }

  if (min_bathrooms && isNaN(parseInt(min_bathrooms))) {
    return res.status(400).json({ message: "Invalid min_bathrooms parameter" });
  }

  if (min_price && max_price && parseInt(min_price) > parseInt(max_price)) {
    return res.status(400).json({
      message: "min_price must be less than or equal to max_price",
    });
  }

  // Build MongoDB Query Object
  const query = {};

  // Location search
  if (address || location_search) {
    query.address = address || location_search;
  }

  // Date filtering - handle both monthly stays and regular stays
  if (date_picker_type === "monthly_stay") {
    if (monthly_start_date && monthly_end_date) {
      query.available_dates = {
        $gte: new Date(monthly_start_date),
        $lte: new Date(monthly_end_date),
      };
    }
  } else {
    if (checkin && checkout) {
      query.available_dates = {
        $gte: new Date(checkin),
        $lte: new Date(checkout),
      };
    }
  }

  // Guest capacity
  if (totalGuests > 0) {
    query.maxGuests = { $gte: totalGuests };
  }

  // Price filtering
  if (min_price) query.pricePerNight = { $gte: parseInt(min_price) };
  if (max_price)
    query.pricePerNight = { ...query.pricePerNight, $lte: parseInt(max_price) };

  // Property type
  if (property_type_id || room_types) {
    query.propertyType = property_type_id || room_types;
  }

  // Bedrooms and bathrooms
  if (min_bedrooms) query.bedrooms = { $gte: parseInt(min_bedrooms) };
  if (min_bathrooms) query.bathrooms = { $gte: parseInt(min_bathrooms) };

  // Amenities filtering
  if (amenities) {
    const amenitiesArray = Array.isArray(amenities) ? amenities : [amenities];
    query.amenities = { $all: amenitiesArray };
  }

  // Sort options
  let sortOptions = {};
  if (sortBy === "price_asc" || sortBy === "price_low") {
    sortOptions.pricePerNight = 1;
  } else if (sortBy === "price_desc" || sortBy === "price_high") {
    sortOptions.pricePerNight = -1;
  } else if (sortBy === "recommended") {
    // Default sorting by rating or relevance
    sortOptions = { rating: -1 };
  }

  const listings = await Listing.find(query)
    .sort(sortOptions)
    .populate("hostId", "firstName lastName profilePhoto")
    .populate("amenities", "name")
    .exec();

  res.status(200).json({
    items: listings,
    search_metadata: {
      date_picker_type,
      location_search,
      monthly_length,
      search_type,
      total_results: listings.length,
    },
  });
};

// Get listing reviews
const getListingReviews = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if listing exists
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Get all reviews for the listing
    const Review = require("../models/Review.model");
    const reviews = await Review.find({ listingId: id })
      .populate("author", "firstName lastName profilePhoto createdAt")
      .sort({ createdAt: -1 });

    // Calculate review statistics
    const totalReviews = reviews.length;
    const avgRating =
      totalReviews > 0
        ? (
            reviews.reduce((sum, review) => sum + review.rating, 0) /
            totalReviews
          ).toFixed(2)
        : 0;

    res.status(200).json({
      reviews,
      statistics: {
        totalReviews,
        avgRating: parseFloat(avgRating),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing,
  searchListings,
  getListingReviews,
};
