const mongoose = require("mongoose");

const wishListSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// compound unique index to prevent duplicates
wishListSchema.index({ user: 1, listing: 1 }, { unique: true });

// optional: index on user for faster queries (covered by compound index already)
wishListSchema.index({ user: 1 });

module.exports =
  mongoose.models.WishList || mongoose.model("WishList", wishListSchema);
