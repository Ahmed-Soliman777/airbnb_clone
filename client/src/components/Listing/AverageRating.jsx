import {
  CheckCircle,
  KeyRound,
  MapPin,
  MessageSquareDot,
  Sparkles,
  Star,
  Tag,
} from "lucide-react";

export default function AverageRating({ reviews }) {
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
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
      <div className="grid grid-cols-3 md:grid-cols-6 gap-6 py-6 border-b">
        {ratingCategories.map((cat) => {
          const IconComponent = cat.Icon;
          return (
            <div key={cat.title} className="flex flex-col gap-1">
              <p className="text-sm text-gray-500">{cat.title}</p>
              <p className="font-semibold">{cat.rating}</p>
              <IconComponent className="w-5 h-5" />
            </div>
          );
        })}
      </div>

      {/* Overall Rating */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">Overall Rating</h3>
        <div className="flex items-center gap-2">
          <Star fill="currentColor" stroke="none" className="w-6 h-6" />
          <span className="text-2xl font-semibold">{averageRating}</span>
        </div>
      </div>
    </div>
  );
}
