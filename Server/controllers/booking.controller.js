const Booking = require("../models/Booking.model.js");
const User = require("../models/User.model.js");
const Listing = require("../models/Listing.model.js");
const Service = require("../models/Service.model.js");
const Experience = require("../models/Experience.model.js");

// create booking
const createBooking = async (req, res) => {
  try {
    const user = req.user._id;
    const { listing, checkInDate, checkOutDate, guestsCount, totalPrice } =
      req.body;

    // Check if a listing exists
    const existingListing = await Listing.findById(listing);
    if (!existingListing)
      return res.status(404).json({ message: "Listing not found" });

    // check dates
    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      return res
        .status(400)
        .json({ message: "Check-out date must be after check-in date" });
    }

    // Check if there is a booking that conflicts with another booking.
    const overlappingBooking = await Booking.findOne({
      listing,
      $or: [
        {
          checkInDate: { $lt: new Date(checkOutDate) },
          checkOutDate: { $gt: new Date(checkInDate) },
        },
      ],
    });
    if (overlappingBooking) {
      return res
        .status(400)
        .json({ message: "This property is already booked for these dates" });
    }

    // create booking
    const booking = await Booking.create({
      user,
      listing,
      checkInDate,
      checkOutDate,
      guestsCount,
      totalPrice,
      status: "pending",
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get booking by Id
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id).populate(
      "user listing service experience"
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // check authorization
    if (
      req.user.role === "guest" &&
      booking.user._id.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this booking" });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get Bookings For User
const getBookingsForUser = async (req, res) => {
  try {
    const userId = req.user._id;

    // check authorization - allow users to view their own bookings, admins can view any
    if (req.user._id.toString() !== userId.toString()) {
      return res.status(403).json({
        message:
          "Not authorized to view other users' bookings from getBookingsForUser ",
        userId,
      });
    }

    const bookings = await Booking.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("listing")
      .populate("service")
      .populate("experience");

    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get Bookings For Listing
const getBookingsForListing = async (req, res) => {
  try {
    const { listingId } = req.params;

    const existingListing = await Listing.findById(listingId);
    if (!existingListing)
      return res.status(404).json({ message: "Listing not found" });

    //check authorization
    if (
      req.user.role === "host" &&
      existingListing.host.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view bookings for this listing" });
    }

    const bookings = await Booking.find({ listing: listingId }).populate(
      "user"
    );
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update Booking Status
// const updateBookingStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     if (!["pending", "confirmed", "cancelled"].includes(status)) {
//       return res.status(400).json({ message: "Invalid status value" });
//     }

//     const booking = await Booking.findById(id).populate(
//       "user listing service experience"
//     );
//     if (!booking) return res.status(404).json({ message: "Booking not found" });

//     // Determine the item (listing, service, or experience)
//     const item = booking.listing || booking.service || booking.experience;

//     // check authorization
//     if (
//       req.user.role === "host" &&
//       item?.host.toString() !== req.user._id.toString()
//     ) {
//       return res
//         .status(403)
//         .json({ message: "Not authorized to update this booking" });
//     }

//     booking.status = status;
//     await booking.save();

//     res.json({ success: true, data: booking });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// update Booking Status
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const booking = await Booking.findById(id).populate(
      "user listing service experience"
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Admin can update any booking
    if (req.user.role === "admin") {
      booking.status = status;
      await booking.save();
      return res.json({ success: true, data: booking });
    }

    // For hosts, check authorization
    if (req.user.role === "host") {
      // Determine the item (listing, service, or experience)
      const item = booking.listing || booking.service || booking.experience;

      // Get the host ID - listings use hostId, services/experiences use host
      const itemHostId = item?.hostId || item?.host;

      if (!itemHostId || itemHostId.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this booking" });
      }

      booking.status = status;
      await booking.save();
      return res.json({ success: true, data: booking });
    }

    // If not admin or host, deny access
    return res
      .status(403)
      .json({ message: "Not authorized to update this booking" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete booking
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id).populate("listing");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Users can delete their own pending bookings
    if (req.user.role !== "admin") {
      // For non-admin users, check ownership and status
      if (booking.user.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "Not authorized to delete this booking" });
      }

      // Only pending bookings can be cancelled by users
      if (booking.status !== "pending") {
        return res
          .status(403)
          .json({ message: "Only pending bookings can be cancelled" });
      }
    }

    await booking.deleteOne();
    res.json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all bookings for host
const getAllBookingsForHost = async (req, res) => {
  try {
    const hostId = req.user._id;

    // Find all listings, services, and experiences owned by this host
    const hostListings = await Listing.find({ hostId: hostId }).select("_id");
    const hostServices = await Service.find({ host: hostId }).select("_id");
    const hostExperiences = await Experience.find({ host: hostId }).select(
      "_id"
    );

    // Get IDs arrays
    const listingIds = hostListings.map((l) => l._id);
    const serviceIds = hostServices.map((s) => s._id);
    const experienceIds = hostExperiences.map((e) => e._id);

    // Find bookings for any of these listings, services, or experiences
    const bookings = await Booking.find({
      $or: [
        { listing: { $in: listingIds } },
        { service: { $in: serviceIds } },
        { experience: { $in: experienceIds } },
      ],
    })
      .populate("user", "firstName lastName email phone profilePhoto")
      .populate("listing", "title hostId")
      .populate("service", "title host")
      .populate("experience", "title host")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ...existing code...

// Get daily payment statistics grouped by date and status (Admin only)
const getDailyPaymentStats = async (req, res) => {
  try {
    const stats = await Booking.aggregate([
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            status: "$status",
          },
          totalAmount: { $sum: "$totalPrice" },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.date",
          statuses: {
            $push: {
              status: "$_id.status",
              totalAmount: "$totalAmount",
              count: "$count",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          statuses: 1,
        },
      },
      { $sort: { date: 1 } },
    ]);

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bookings for admin with populated user and listing
const getAllBookingsForAdmin = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "firstName lastName email")
      .populate("listing", "title")
      .populate("service", "title")
      .populate("experience", "title")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getBookingById,
  getBookingsForUser,
  getBookingsForListing,
  updateBookingStatus,
  deleteBooking,
  getAllBookingsForHost,
  getDailyPaymentStats,
  getAllBookingsForAdmin,
};
