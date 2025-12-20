const mongoose = require("mongoose");
const Amenities = require("./Amenities.model.js");
const User = require("./User.model.js");
const Review = require("./Review.model.js");

/// Listing Schema
const listingSchema = new mongoose.Schema(
  {
    title: {
      en: {
        type: String,
        required: true,
        trim: true,
      },
      ar: {
        type: String,
        required: true,
        trim: true,
      },
    },
    description: {
      en: {
        type: String,
        required: true,
      },
      ar: {
        type: String,
        required: true,
      },
    },
    propertyType: {
      type: String,
      enum: ["apartment", "house", "villa", "shared_room", "private_room"],
      required: true,
    },
    address: {
      street: String,
      city: String,
      country: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    cleaningFee: {
      type: Number,
      default: 0,
    },
    maxGuests: {
      type: Number,
      required: true,
    },
    bedrooms: {
      type: Number,
      default: 1,
    },
    bathrooms: {
      type: Number,
      default: 1,
    },
    images: [
      {
        url: String,
        caption: String,
      },
    ],
    amenities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Amenities",
      },
    ],
    highlightFeatures: [
      {
        icon: {
          type: String,
          enum: ["Info", "MapPin", "Users", "Home", "Star", "Heart", "Key", "Wifi", "Car", "Shield"],
        },
        title: {
          en: {
            type: String,
            required: true,
          },
          ar: {
            type: String,
            required: true,
          },
        },
        description: {
          en: {
            type: String,
            required: true,
          },
          ar: {
            type: String,
            required: true,
          },
        },
      },
    ],
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    availability: [
      {
        startDate: {
          type: Date,
          required: true,
        },
        endDate: {
          type: Date,
          required: true,
        },
      },
    ],
    ratingAvg: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Listing || mongoose.model("Listing", listingSchema);
