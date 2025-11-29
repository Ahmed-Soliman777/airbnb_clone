import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { getReviewsByListing } from "@/store/Slices/reviewSlice";

export default function ReviewsSection() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { reviews, status, error } = useSelector((state) => state.review);
  const [expandedReviews, setExpandedReviews] = useState({});

  useEffect(() => {
    if (id) {
      dispatch(getReviewsByListing(id));
    }
  }, [id, dispatch]);

  // Calculate average rating and counts
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        ).toFixed(2)
      : 0;

  // Calculate rating categories (approximate distribution)
  const ratingCategories = [
    { title: "Cleanliness", rating: averageRating, icon: "🧼" },
    { title: "Accuracy", rating: averageRating, icon: "✔️" },
    { title: "Check-in", rating: averageRating, icon: "🔑" },
    { title: "Communication", rating: averageRating, icon: "💬" },
    { title: "Location", rating: averageRating, icon: "📍" },
    { title: "Value", rating: averageRating, icon: "🏷️" },
  ];

  const toggleShowMore = (reviewId) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const getYearsOnAirbnb = (joinDate) => {
    const years = new Date().getFullYear() - new Date(joinDate).getFullYear();
    return years > 0 ? `${years} year${years > 1 ? "s" : ""} on Airbnb` : "New to Airbnb";
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  if (status === "loading") {
    return (
      <div className="max-w-5xl mx-auto py-10">
        <p className="text-gray-600">Loading reviews...</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="max-w-5xl mx-auto py-10">
        <p className="text-red-600">Error loading reviews: {error}</p>
      </div>
    );
  }

  if (totalReviews === 0) {
    return (
      <div className="max-w-5xl mx-auto py-10">
        <h2 className="text-2xl font-semibold mb-6">No reviews yet</h2>
        <p className="text-gray-600">Be the first to leave a review!</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10">
      {/* Header */}
      <h2 className="text-2xl font-semibold flex items-center gap-2 mb-6">
        ⭐ {averageRating} ·{" "}
        <span className="underline cursor-pointer">
          {totalReviews} review{totalReviews !== 1 ? "s" : ""}
        </span>
      </h2>

      {/* Rating categories grid */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-6 py-6 border-b">
        {ratingCategories.map((cat) => (
          <div key={cat.title} className="flex flex-col gap-1">
            <p className="text-sm text-gray-500">{cat.title}</p>
            <p className="font-semibold">{cat.rating}</p>
            <span className="text-xl">{cat.icon}</span>
          </div>
        ))}
      </div>

      {/* Reviews grid */}
      <div className="grid md:grid-cols-2 gap-10 mt-10">
        {reviews.map((review) => {
          const isExpanded = expandedReviews[review._id];
          const shouldTruncate = review.comment.length > 150;

          return (
            <div key={review._id} className="flex gap-4">
              <img
                src={
                  review.author?.avatar ||
                  `https://ui-avatars.com/api/?name=${review.author?.firstName}+${review.author?.lastName}&background=random`
                }
                alt={`${review.author?.firstName} ${review.author?.lastName}`}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">
                  {review.author?.firstName} {review.author?.lastName}
                </p>
                <p className="text-sm text-gray-500">
                  {getYearsOnAirbnb(review.author?.createdAt)}
                </p>

                <div className="flex items-center gap-2 text-sm mt-2">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)} · {formatDate(review.createdAt)}
                </div>

                <p className="mt-2 text-gray-700">
                  {isExpanded || !shouldTruncate
                    ? review.comment
                    : truncateText(review.comment)}
                </p>

                {shouldTruncate && (
                  <button
                    className="text-sm underline mt-2"
                    onClick={() => toggleShowMore(review._id)}
                  >
                    {isExpanded ? "Show less" : "Show more"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
