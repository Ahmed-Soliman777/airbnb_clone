const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema(
  {
    // user reference
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // listing reference - optional as it could be a service or experience
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
    },
    // service reference
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
    // experience reference
    experience: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Experience",
    },
    // booking details
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          // If it's a Service or Experience, allow same-day end dates
          if (this.service || this.experience) {
            return value >= this.checkInDate;
          }
          // Default (Listing): Check-out must be strictly after Check-in
          return value > this.checkInDate;
        },
        message: "Check-out date must be after check-in date (or same day for services)",
      },
    },
    guestsCount: {
      type: Number,
      required: true,
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
      required: true,
    },
    stripeSessionId: String,
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
