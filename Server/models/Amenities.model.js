const mongoose = require("mongoose");

const amenitiesSchema = new mongoose.Schema({
  name: {
    en: {
      type: String,
      trim: true,
      required: true,
    },
    ar: {
      type: String,
      trim: true,
      required: true,
    },
  },
  icon: {
    type: String,
    required: true,
  },
  description: {
    en: {
      type: String,
      trim: true,
    },
    ar: {
      type: String,
      trim: true,
    },
  },
});

module.exports =
  mongoose.models.Amenities || mongoose.model("Amenities", amenitiesSchema);
