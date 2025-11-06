import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
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

export const Listing = mongoose.model("Listing", listingSchema);
