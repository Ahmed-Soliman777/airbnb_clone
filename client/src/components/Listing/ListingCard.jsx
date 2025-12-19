import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toggleListing } from "@/store/Slices/wishlistSlice";

export default function ListingCard({ listing, size = "small" }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const savedListings = useSelector((state) => state.wishlist.savedListings);

  const listingId = listing._id || listing.id;
  const isFav = savedListings[listingId]?.isSaved || false;

  // Define image sizes
  const imageSizeClasses = {
    small: "w-36 h-36 lg:w-full lg:aspect-square",
    large: "w-full aspect-square",
  };

  return (
    <Card
      className="overflow-hidden border-0 shadow-none gap-3 cursor-pointer hover:opacity-90 transition-opacity"
      onClick={() => navigate(`/room/${listingId}`)}
    >
      <div className={`relative ${imageSizeClasses[size]}`}>
        <img
          src={
            listing.images?.[0]?.url ||
            listing.image ||
            "https://via.placeholder.com/400"
          }
          alt={listing.title || listing.name}
          className="w-full h-full object-cover rounded-2xl"
        />
        <button
          className="absolute top-2 right-2 hover:scale-106 transition-transform duration-300"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(toggleListing(listingId));
          }}
        >
          <Heart
            size={25}
            className="stroke-gray-100"
            fill={isFav ? "red" : "rgba(0,0,0,0.45)"}
          />
        </button>
        <div className="absolute top-2 left-2 bg-white text-xs font-medium px-2 py-1 rounded-full">
          Guest favourite
        </div>
      </div>

      <CardContent className="px-1">
        <h3 className="font-medium text-[0.8rem]">
          {listing.title || listing.name}
        </h3>
        <p className="text-xs text-gray-500">
          {listing.location || listing.city}
        </p>
        <p className="text-[0.8rem] mt-1">
          ${listing.price || listing.pricePerNight} per night
          {listing.rating && (
            <span className="text-gray-500 ml-2">★ {listing.rating}</span>
          )}
        </p>
      </CardContent>
    </Card>
  );
}
