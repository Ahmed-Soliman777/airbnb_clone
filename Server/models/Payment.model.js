//----
// THIS IS A VIRTUAL MODEL TO SIMULATE PAYMENT SERVICE
//----
const mongoose = require("mongoose");
// Define the schema for user registration details
const transactionSchema = mongoose.Schema({
  User: {
    type: mongoose.Schema.Types.ObjectId,
<<<<<<< HEAD
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
=======
    ref: "User",
  },
  // ------- TEST BASE
  // Name: { type: String, required: true },
  // Email: { type: String, required: true },
  // City: { type: String, required: true },
  // PassportID: { type: String, required: true },
  // PhoneNumber: { type: Number, required: false },
  // ------- TEST BASE
  transactions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "reservationModel" },
  ],
});
const transactionModel =
  mongoose.models.UserRegisteration ||
  mongoose.model("UserRegisteration", transactionSchema);
>>>>>>> 7de61d2ebbaafd039e6afdecfddcf375fcefdecd
module.exports = transactionModel;
