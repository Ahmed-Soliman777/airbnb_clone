import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchWishlist } from "@/store/Slices/wishlistSlice";
import ListingCard from "./ListingCard";

export default function PopularHomesCarousel({ listings = [] }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    // Only fetch wishlist if user is logged in
    if (user) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, user]);
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
              className="basis-1/2 max-w-1/2 md:basis-[25%] md:max-w-[25%] lg:basis-[14.285%] lg:max-w-[14.285%] shrink-0"
            >
              <ListingCard listing={listing} />
            </CarouselItem>
          ))}
          {/*---------------- End of Carousel Item ---------------- */}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
