const mongoose = require("mongoose");

const recentlyViewedSchema = new mongoose.Schema(
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
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique user-listing pairs
recentlyViewedSchema.index({ user: 1, listing: 1 }, { unique: true });

// Index for faster queries by user and sorting by viewedAt
recentlyViewedSchema.index({ user: 1, viewedAt: -1 });

module.exports =
  mongoose.models.RecentlyViewed ||
  mongoose.model("RecentlyViewed", recentlyViewedSchema);
