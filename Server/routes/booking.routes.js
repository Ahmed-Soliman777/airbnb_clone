const express = require("express");
const router = express.Router();

const {
  createBooking,
  getBookingById,
  getBookingsForUser,
  getBookingsForListing,
  updateBookingStatus,
  deleteBooking,
  getAllBookingsForHost,
} = require("../controllers/booking.controller.js");

const authMiddleware = require("../middleware/userMiddleware");
const authorization = require("../middleware/authUser");

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Booking management
 */

/**
 * @swagger
 * /booking:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - listing
 *               - checkInDate
 *               - checkOutDate
 *               - guestsCount
 *               - totalPrice
 *             properties:
 *               user:
 *                 type: string
 *                 description: User ID
 *               listing:
 *                 type: string
 *                 description: Listing ID
 *               checkInDate:
 *                 type: string
 *                 format: date
 *               checkOutDate:
 *                 type: string
 *                 format: date
 *               guestsCount:
 *                 type: integer
 *               totalPrice:
 *                 type: number
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/booking",
  authMiddleware,
  authorization("guest", "admin"),
  createBooking
);

/**
 * @swagger
 * /booking/user/{userId}:
 *   get:
 *     summary: Get all bookings for a specific user
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of bookings
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/booking/user",
  authMiddleware,
  getBookingsForUser
);

/**
 * @swagger
 * /booking/{id}:
 *   get:
 *     summary: Get a booking by ID
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 */
router.get(
  "/booking/:id",
  authMiddleware,
  authorization("guest", "host", "admin"),
  getBookingById
);

/**
 * @swagger
 * /booking/listing/{listingId}:
 *   get:
 *     summary: Get all bookings for a specific listing
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listingId
 *         required: true
 *         schema:
 *           type: string
 *         description: Listing ID
 *     responses:
 *       200:
 *         description: List of bookings
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/booking/listing/:listingId",
  authMiddleware,
  authorization("host", "admin"),
  getBookingsForListing
);

/**
 * @swagger
 * /booking/update/{id}:
 *   patch:
 *     summary: Update booking status
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled]
 *     responses:
 *       200:
 *         description: Booking updated
 *       400:
 *         description: Invalid status
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Booking not found
 */
router.patch(
  "/booking/update/:id",
  authMiddleware,
  authorization("host", "admin"),
  updateBookingStatus
);

/**
 * @swagger
 * /booking/{id}:
 *   delete:
 *     summary: Delete a booking by ID
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Booking not found
 */
router.delete(
  "/booking/:id",
  authMiddleware,
  deleteBooking
);

router.get("/bookings/host", authMiddleware, getAllBookingsForHost);

module.exports = router;
