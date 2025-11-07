// Import required models and dependencies
const transactionModel = require('../models/Payment.model');  // Import the Payment model for handling transactions
const Booking = require('../models/Booking.model');          // Import the Booking model for reservation details
const { default: mongoose } = require('mongoose');           // Import mongoose for MongoDB operations
const stripe = require('stripe')(process.env.STRIP_SECRET_KEY); // Initialize Stripe with secret key

// Controller function to create or update a user's transaction profile
// This function is called when a new booking transaction needs to be recorded
async function handleCreateTransactions(req, res) {
    try {
        // Extract booking ID from request parameters
        const { id } = req.params

        // Find the booking in database using the ID
        const booking = await Booking.findById(id);
        // If booking doesn't exist, return 404 error
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        // Get the authenticated user's ID from the request
        // This comes from the auth middleware
        const userId = req.user._id;
        // Validate that we have a user ID
        if (!userId) {
            return res.status(400).json({ message: "Missing userId" });
        }

        // Try to find an existing transaction profile for this user
        let transactionProfile = await transactionModel.findOne({ User: userId });
        
        if (!transactionProfile) {
            // If no profile exists, create a new one with the current booking
            transactionProfile = await transactionModel.create({
                User: userId,
                transactions: [{ bookingId: new mongoose.Types.ObjectId(id) }],
            });
        } else {
            // If profile exists, add the new booking to their transactions
            transactionProfile.transactions.push({ bookingId: new mongoose.Types.ObjectId(id) });
            // Log for debugging purposes
            console.log("🧾 Transactions before save:", transactionProfile.transactions);


            await transactionProfile.save();
        }

        res.status(201).json(transactionProfile);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// GET ALL TRANSACTION PROFILES
// Controller function to retrieve all transaction profiles with user and payment details
async function handleGetTransactions(req, res) {
    try {
        // Check if user is authenticated by verifying their token in cookies
        const userToken = req.cookies.token
        if (!userToken) {
            return res.status(401).json({ message: "ACCESS DENIED" });
        }

        // Fetch all transactions and populate related data
        const transactions = await transactionModel.find()
            .populate("User", "name email")       // Include user's name and email
            .populate("transactions");            // Include full transaction details

        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// HANDLE STRIPE PAYMENT + RESERVATION CREATION
// Controller function to handle the payment process and booking creation
async function handlePayment(req, res) {
    try {
        // Get authenticated user's ID from request
        const userId = req.user._id
        // Extract booking details from request body
        const { user, listing, checkInDate, checkOutDate, guestsCount, totalPrice } = req.body;

        // Validate user authentication
        if (!userId) {
            return res.status(400).json({ message: "Missing userId" });
        }

        // 1. Initialize Stripe payment session with booking details
        const session = await stripe.checkout.sessions.create({
            // Configure the payment line items
            line_items: [{
                price_data: {
                    currency: 'usd',                    // Set currency to USD
                    product_data: { name: `Room` },     // Product name shown on checkout
                    unit_amount: totalPrice * 100,      // Convert price to cents for Stripe
                },
                quantity: 1,                           // Single room booking
            }],
            mode: 'payment',                           // One-time payment mode
            // Allow shipping addresses from these countries
            shipping_address_collection: { allowed_countries: ['US', 'CA', 'EG'] },
            // Redirect URLs after payment completion or cancellation
            success_url: `${process.env.BASE_URL}/complete`,
            cancel_url: `${process.env.BASE_URL}/cancel`,
        });

        // 2. Create booking entry
        const booking = await Booking.create({
            user: userId,
            listing,
            checkInDate,
            checkOutDate,
            guestsCount,
            totalPrice,
            status: 'confirmed',
            stripeSessionId: session.id,
        });

        // 3. Attach bookin to user’s transaction profile
        let userTransaction = await transactionModel.findOne({ User: userId });
        if (!userTransaction) {
            userTransaction = await transactionModel.create({
                User: userId,
                transactions: [{ bookingId: booking._id }]
            });
        } else {
            userTransaction.transactions.push({ bookingId: booking._id });
            await userTransaction.save();
        }

        // 4. Send back the Stripe checkout URL and booking reference
        res.status(200).json({
            checkoutUrl: session.url,    // URL where user will complete payment
            bookingId: booking._id       // Reference ID for the booking
        });

    } catch (err) {
        // Handle any errors that occur during the process
        res.status(500).json({ message: err.message });
    }
}

// Export all controller functions for use in routes
module.exports = {
    handleCreateTransactions,  // Create/update transaction profiles
    handleGetTransactions,     // Retrieve all transactions
    handlePayment             // Handle payment processing and booking creation
};
