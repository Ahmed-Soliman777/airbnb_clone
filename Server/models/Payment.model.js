//----
// THIS IS A VIRTUAL MODEL TO SIMULATE PAYMENT SERVICE
//----
const mongoose = require("mongoose");
// Define the schema for user registration details
const transactionSchema = mongoose.Schema({
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  transactions: [
    {
      stripeSessionId: String,
      bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true }, // booking id
      createdAt: { type: Date, default: Date.now },
    },
  ],
});
const transactionModel = mongoose.model("Payments", transactionSchema);
module.exports = transactionModel;
