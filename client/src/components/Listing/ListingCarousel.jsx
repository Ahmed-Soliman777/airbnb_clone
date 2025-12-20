import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";

import {
  fetchWishlistCollections,
  toggleListing,
  openCreateDialog,
} from "@/store/Slices/wishlistSlice";
import WishlistDialog from "@/components/Wishlist/WishlistDialog";
import { isAuthenticated } from "@/utils/cookies";
export default function PopularHomesCarousel({ listings = [] }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const savedListings = useSelector((state) => state.wishlist.savedListings);
  const collections = useSelector((state) => state.wishlist.collections);
  const user = useSelector((state) => state.auth.user);
  const showCreateDialog = useSelector(
    (state) => state.wishlist.showCreateDialog
  );
  useEffect(() => {
    if (user) {
      dispatch(fetchWishlistCollections());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      dispatch(fetchWishlistCollections());
    }
  }, [dispatch, user]);

  const handleHeartClick = (e, listingId) => {
    e.stopPropagation();

    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    const isSaved = savedListings[listingId]?.isSaved;

    if (isSaved) {
      dispatch(toggleListing(listingId));
    } else {
      dispatch(
        openCreateDialog({
          listingId,
          collections: collections,
        })
      );
    }
  };

  return (
    <section className="relative mx-auto">
      {/*--------------- Start of Carousel ------------------- */}
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full relative"
      >
        {/* ----------------Arrows---------------- */}
        <div className="absolute -top-13 right-0 flex gap-2">
          <CarouselPrevious className=" static translate-y-0 border rounded-full w-6 h-6 flex items-center justify-center shadow-sm bg-gray-100 hover:scale-110 transition-transform duration-300 disabled:cursor-not-allowed" />
          <CarouselNext className=" static translate-y-0 border rounded-full w-6 h-6 flex items-center justify-center shadow-sm hover:bg-gray-100" />
        </div>

        <CarouselContent className="-ml-2 md:-ml-4 gap-0">
          {/*---------------- Start of Carousel Item ---------------- */}

          {listings.map((listing) => {
            const listingId = listing._id || listing.id;
            const isFav = savedListings[listingId]?.isSaved || false;
            return (
              <CarouselItem
                key={listing._id || listing.id}
                className="basis-1/2 max-w-1/2 md:basis-[25%] md:max-w-[25%] lg:basis-[14.285%] lg:max-w-[14.285%] shrink-0"
              >
                {/*---------------- Start of Cards ---------------- */}
                <Card
                  className="overflow-hidden border-0 shadow-none gap-3 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => navigate(`/room/${listing._id || listing.id}`)}
                >
                  <div className="relative w-36 h-36 lg:w-full lg:aspect-square">
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
                      className="absolute top-2 right-2 hover:scale-106 transition-transform duration-300 cursor-pointer"
                      onClick={(e) => handleHeartClick(e, listingId)}
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
                        <span className="text-gray-500 ml-2">
                          ★ {listing.rating}
                        </span>
                      )}
                    </p>
                  </CardContent>
                </Card>
                {/*---------------- End of Cards ---------------- */}
              </CarouselItem>
            );
          })}

          {/*---------------- End of Carousel Item ---------------- */}
        </CarouselContent>
      </Carousel>
      {/* Wishlist Dialog */}
      {showCreateDialog && <WishlistDialog />}
    </section>
  );
}
