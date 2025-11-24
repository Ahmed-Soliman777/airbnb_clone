const transactionModel = require("../models/Payment.model");
const Booking = require("../models/Booking.model");
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
    const { listing, checkInDate, checkOutDate, guestsCount, totalPrice } =
      req.body;

    //  Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Booking Reservation" },
            unit_amount: totalPrice * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.BASE_URL}/api/complete`,
      cancel_url: `${process.env.BASE_URL}/api/cancel`,
    });

    // Create Booking entry (correct field names)
    const booking = await Booking.create({
      user: userId,
      listing,
      checkInDate,
      checkOutDate,
      guestsCount,
      totalPrice,
      status: "pending",
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

module.exports = {
  handleCreateTransactions,
  handleGetTransactions,
  handlePayment,
};
