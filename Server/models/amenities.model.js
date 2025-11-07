const mongoose = require("mongoose");

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

module.exports = mongoose.model("Amenities", amenitiesSchema);
