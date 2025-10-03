const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
  ,
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing'
  }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
