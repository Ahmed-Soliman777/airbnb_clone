import { Star } from "lucide-react";
import { useState } from "react";

export default function ReviewsList({ reviews }) {
  const [expandedReviews, setExpandedReviews] = useState({});

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
    return years > 0
      ? `${years} year${years > 1 ? "s" : ""} on Airbnb`
      : "New to Airbnb";
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  if (reviews.length === 0) {
    return (
      <div className="mt-10">
        <p className="text-gray-600">
          No reviews yet. Be the first to leave a review!
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-10 mt-10">
      {reviews.map((review) => {
        const isExpanded = expandedReviews[review._id];
        const shouldTruncate = review.comment.length > 150;

        return (
          <div key={review._id} className="flex gap-4">
            <img
              src={
                review.author?.profilePhoto ||
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
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={`filled-${i}`}
                    className="w-4 h-4 fill-current text-black"
                  />
                ))}
                {[...Array(5 - review.rating)].map((_, i) => (
                  <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
                ))}
                <span className="ml-1">· {formatDate(review.createdAt)}</span>
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
  );
}
