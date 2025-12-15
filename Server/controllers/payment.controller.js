const transactionModel = require("../models/Payment.model");
const Booking = require("../models/Booking.model");
const Listing = require("../models/Listing.model");
const Service = require("../models/Service.model");
const Experience = require("../models/Experience.model");
const stripe = require("stripe")(process.env.STRIP_SECRET_KEY);

const jwt = require("jsonwebtoken");

// CREATE A TRANSACTION PROFILE FOR A USER (if not exists)
async function handleCreateTransactions(req, res) {
  try {
    const userToken = req.headers["authorization"];
    if (!userToken) {
      return res.status(401).json({ message: "ACCESS DENIED" });
    }

    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    // Check if transaction profile already exists for this user
    let transactionProfile = await transactionModel.findOne({ User: userId });
    if (!transactionProfile) {
      transactionProfile = await transactionModel.create({
        User: userId,
        transactions: [],
      });
    }

    res.status(201).json(transactionProfile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// GET ALL TRANSACTION PROFILES (with reservations)
async function handleGetTransactions(req, res) {
  try {
    const userToken = req.headers["authorization"];
    if (!userToken) {
      return res.status(401).json({ message: "ACCESS DENIED" });
    }

    const transactions = await transactionModel
      .find()
      .populate("User", "name email") // populate user info
      .populate("transactions"); // populate reservations

    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// HANDLE STRIPE PAYMENT + RESERVATION CREATION
async function handlePayment(req, res) {



  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.userId;
  console.log("Decoded token:", decoded);
  console.log("User ID:", userId);

  try {
    const { listing, service, experience, checkInDate, checkOutDate, guestsCount, totalPrice } =
      req.body;

    //  Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Booking Reservation" },
            unit_amount: Math.round(totalPrice * 100), // Ensure integer
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment/cancel`,
    });

    // Create Booking entry
    const booking = await Booking.create({
      user: userId,
      listing,
      service,
      experience,
      checkInDate,
      checkOutDate,
      guestsCount,
      totalPrice,
      status: "confirmed",
      stripeSessionId: session.id,
    });

    //Save booking reference in transactions
    let userTransaction = await transactionModel.findOne({ User: userId });
    if (!userTransaction) {
      userTransaction = await transactionModel.create({
        User: userId,
        transactions: [booking._id],
      });
    } else {
      userTransaction.transactions.push(booking._id);
      await userTransaction.save();
    }

    // Send Stripe Checkout link back to frontend
    res.status(200).json({
      checkoutUrl: session.url,
      bookingId: booking._id,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// VERIFY STRIPE PAYMENT SESSION
async function verifyPayment(req, res) {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ message: "Session ID is required" });
    }

    // Retrieve the Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Find the booking by session ID
    const booking = await Booking.findOne({ stripeSessionId: sessionId });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update booking status based on payment status
    if (session.payment_status === "paid") {
      booking.status = "confirmed";
      await booking.save();

      return res.status(200).json({
        success: true,
        status: "confirmed",
        booking: booking,
        message: "Payment verified successfully",
      });
    } else {
      return res.status(200).json({
        success: false,
        status: session.payment_status,
        message: "Payment not completed",
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// GET HOST PAYMENTS/PROFITS
async function getHostPayments(req, res) {
  try {
    const hostId = req.user._id;

    // Find all listings, services, and experiences owned by this host
    const hostListings = await Listing.find({ hostId: hostId }).select("_id");
    const hostServices = await Service.find({ host: hostId }).select("_id");
    const hostExperiences = await Experience.find({ host: hostId }).select("_id");

    // Get IDs arrays
    const listingIds = hostListings.map(l => l._id);
    const serviceIds = hostServices.map(s => s._id);
    const experienceIds = hostExperiences.map(e => e._id);

    // Find all bookings (confirmed and pending) for this host's properties
    const bookings = await Booking.find({
      $or: [
        { listing: { $in: listingIds } },
        { service: { $in: serviceIds } },
        { experience: { $in: experienceIds } }
      ]
    })
      .populate("user", "firstName lastName email phone profilePhoto")
      .populate("listing", "title hostId")
      .populate("service", "title host")
      .populate("experience", "title host")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  handleCreateTransactions,
  handleGetTransactions,
  handlePayment,
  verifyPayment,
  getHostPayments,
};
