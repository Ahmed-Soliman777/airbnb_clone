const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
    },
  },
  { timestamps: true }
);

//use || to avoid model overwrite error in dev environment
module.exports =
  mongoose.models.Review || mongoose.model("Review", reviewSchema);
