import mongoose from "mongoose";

const amenitiesSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
});

export const Amenities = mongoose.model("Amenities", amenitiesSchema);
