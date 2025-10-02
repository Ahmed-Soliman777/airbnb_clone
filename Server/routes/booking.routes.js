const express = require("express");
const router = express.Router();

const {
  createBooking,
  getBookingById,
  getBookingsForUser,
  getBookingsForListing,
  updateBookingStatus,
  deleteBooking,
} = require("../controllers/Booking_Controllers/BookingCtrl");

const authMiddleware = require("../middleware/userMiddleware");
const authorization = require("../middleware/authUser");

// -------------------- Routes -------------------- //

// create a new booking
router.post(
  "/booking",
  authMiddleware,
  authorization("guest", "admin"),
  createBooking
);

// get booking by Id
router.get(
  "/booking/:id",
  authMiddleware,
  authorization("guest", "host", "admin"),
  getBookingById
);

// get Bookings For User
router.get(
  "/booking/user/:userId",
  authMiddleware,
  authorization("guest", "admin"),
  getBookingsForUser
);

// get Bookings For Listing
router.get(
  "/booking/listing/:listingId",
  authMiddleware,
  authorization("host", "admin"),
  getBookingsForListing
);

//update booking
router.patch(
  "/booking/update/:id",
  authMiddleware,
  authorization("host", "admin"),
  updateBookingStatus
);

// delete booking
router.delete(
  "/booking/:id",
  authMiddleware,
  authorization("guest", "host", "admin"),
  deleteBooking
);

module.exports = router;
