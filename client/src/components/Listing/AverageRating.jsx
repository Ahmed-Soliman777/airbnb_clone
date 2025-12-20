import {
  CheckCircle,
  KeyRound,
  MapPin,
  MessageSquareDot,
  Sparkles,
  Star,
  Tag,
} from "lucide-react";

export default function AverageRating({ reviews, statistics }) {
  // Use statistics if provided, otherwise calculate from reviews
  const totalReviews = statistics?.totalReviews ?? reviews.length;
  const averageRating = statistics?.avgRating
    ? statistics.avgRating.toFixed(2)
    : totalReviews > 0
    ? (
        reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      ).toFixed(2)
    : "0";

  // Calculate rating distribution
  const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((review) => {
    const rating = Math.floor(review.rating);
    if (rating >= 1 && rating <= 5) {
      ratingDistribution[rating]++;
    }
  });

  const ratingCategories = [
    { title: "Cleanliness", rating: averageRating, Icon: Sparkles },
    { title: "Accuracy", rating: averageRating, Icon: CheckCircle },
    { title: "Check-in", rating: averageRating, Icon: KeyRound },
    { title: "Communication", rating: averageRating, Icon: MessageSquareDot },
    { title: "Location", rating: averageRating, Icon: MapPin },
    { title: "Value", rating: averageRating, Icon: Tag },
  ];

  return (
    <div>
      {/* Header */}
      <h2 className="text-2xl font-semibold flex items-center gap-2 mb-6">
        <Star fill="currentColor" stroke="none" />
        {averageRating} ·{" "}
        <span className="underline cursor-pointer">
          {totalReviews} review{totalReviews !== 1 ? "s" : ""}
        </span>
      </h2>

      {/* Rating categories grid */}
      <div className="grid grid-cols-3 md:grid-cols-7 gap-6 py-6 border-b">
        {/* Overall Rating with star distribution */}
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-500 mb-2">Overall Rating</p>
          <div className="space-y-1">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-1">
                <span className="text-xs font-medium w-2">{star}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-black h-1.5 rounded-full transition-all"
                    style={{
                      width: `${
                        totalReviews > 0
                          ? (ratingDistribution[star] / totalReviews) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        {ratingCategories.map((cat, index) => {
          const IconComponent = cat.Icon;
          return (
            <div key={cat.title} className="flex flex-col gap-1 relative">
              <p className="text-sm text-gray-500">{cat.title}</p>
              <p className="font-semibold">{cat.rating}</p>
              <IconComponent className="w-5 h-5" />
              {index < ratingCategories.length - 1 && (
                <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-200" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
