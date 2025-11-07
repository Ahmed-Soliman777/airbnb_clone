const Review = require("../models/Review.model");

const createReview = async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ listingId: req.params.listingId });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createReview, getReviews, deleteReview };
