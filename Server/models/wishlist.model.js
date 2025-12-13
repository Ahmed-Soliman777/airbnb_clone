const mongoose = require("mongoose");

const wishlistCollectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    listings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
      },
    ],
  },
  {
    timestamps: true,
  }
);

wishlistCollectionSchema.index({ user: 1, name: 1 }, { unique: true });
module.exports =
  mongoose.models.WishlistCollection ||
  mongoose.model("WishlistCollection", wishlistCollectionSchema);
