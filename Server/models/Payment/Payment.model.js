//----
// THIS IS A VIRTUAL MODEL TO SIMULATE PAYMENT SERVICE
//----
const mongoose = require("mongoose");
// Define the schema for user registration details
const transactionSchema = mongoose.Schema({
  Name: { type: String, required: true },
  Email: { type: String, required: true },
  City: { type: String, required: true },
  PassportID: { type: String, required: true },
  PhoneNumber: { type: Number, required: false },
  transactions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "reservationModel" },
  ],
});
const transactionModel = mongoose.model("UserRegisteration", transactionSchema);
module.exports = transactionModel;
