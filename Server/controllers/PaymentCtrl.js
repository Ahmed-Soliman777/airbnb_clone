const transactionModel = require("../models/Payment.model");
const { reservationModel } = require("../models/Booking.model");
const stripe = require("stripe")(process.env.STRIP_SECRET_KEY);

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
  try {
    const { serviceName, roomType, checkIn, checkOut, guests, price, userId } =
      req.body;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    // 1. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: `${serviceName} - ${roomType}` },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      shipping_address_collection: { allowed_countries: ["US", "CA", "EG"] },
      success_url: `${process.env.BASE_URL}/complete`,
      cancel_url: `${process.env.BASE_URL}/cancel`,
    });

    // 2. Create Reservation entry
    const reservation = await reservationModel.create({
      serviceName,
      roomType,
      checkIn,
      checkOut,
      guests,
      price,
      paymentStatus: "pending",
      stripeSessionId: session.id,
    });

    // 3. Attach reservation to user’s transaction profile
    let userTransaction = await transactionModel.findOne({ User: userId });
    if (!userTransaction) {
      userTransaction = await transactionModel.create({
        User: userId,
        transactions: [reservation._id],
      });
    } else {
      userTransaction.transactions.push(reservation._id);
      await userTransaction.save();
    }

    // 4. Return session URL and reservation id
    res.status(200).json({
      checkoutUrl: session.url,
      reservationId: reservation._id,
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
