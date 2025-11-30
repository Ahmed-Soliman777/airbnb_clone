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
        {/* Overall Rating */}
        <div className="mb-6">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-gray-500">Overall Rating</p>
            <p className="font-semibold">{averageRating}</p>
            <Star fill="currentColor" stroke="none" className="w-5 h-5" />
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
