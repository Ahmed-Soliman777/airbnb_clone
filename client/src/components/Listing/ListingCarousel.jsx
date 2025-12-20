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
<<<<<<< HEAD
import ListingCard from "./ListingCard";
import { fetchWishlistCollections } from "@/store/Slices/wishlistSlice";
import WishlistDialog from "../Wishlist/WishlistDialog";
=======
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
>>>>>>> main

export default function PopularHomesCarousel({
  listings = [],
  cardSize = "small",
}) {
  const dispatch = useDispatch();
<<<<<<< HEAD
=======
  const navigate = useNavigate();
  const savedListings = useSelector((state) => state.wishlist.savedListings);
  const collections = useSelector((state) => state.wishlist.collections);
>>>>>>> main
  const user = useSelector((state) => state.auth.user);
  const showCreateDialog = useSelector(
    (state) => state.wishlist.showCreateDialog
  );
  useEffect(() => {
    if (user) {
      dispatch(fetchWishlistCollections());
    }
  }, [dispatch, user]);

  // Define carousel item sizes
  const carouselItemSizes = {
    small:
      "basis-1/2 max-w-1/2 md:basis-[25%] md:max-w-[25%] lg:basis-[14.285%] lg:max-w-[14.285%]",
    large:
      "basis-1/2 max-w-1/2 md:basis-[25%] md:max-w-[25%] lg:basis-[20%] lg:max-w-[20%]",
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
          {listings.map((listing) => (
            <CarouselItem
              key={listing._id || listing.id}
              className={`${carouselItemSizes[cardSize]} shrink-0`}
            >
              <ListingCard listing={listing} size={cardSize} />
            </CarouselItem>
          ))}
          {/*---------------- End of Carousel Item ---------------- */}
        </CarouselContent>
      </Carousel>
      {/* Wishlist Dialog */}
      {showCreateDialog && <WishlistDialog />}
    </section>
  );
}
