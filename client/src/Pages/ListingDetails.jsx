import BookingHome from "@/components/BookingHome/BookingHome";
import Amenity from "@/components/Listing/Amenity";
import GuestFavouriteIcon from "@/components/Listing/GuestFavouriteIcon";
import ListingGallery from "@/components/Listing/ListingGallery";
import AverageRating from "@/components/Listing/AverageRating";
import ReviewsList from "@/components/Listing/ReviewsList";
import ListingLocation from "@/components/Listing/ListingLocation";
import { Card } from "@/components/ui/card";
import { GetListingById } from "@/store/Slices/listingSlice";
import { getReviewsByListing } from "@/store/Slices/reviewSlice";
import { FlagOff, Info, MapPin, Users } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

const placeholderBedroomImg =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80";

const ListingDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { listing, status, error } = useSelector((state) => state.listing);
  const { reviews } = useSelector((state) => state.review);

  useEffect(() => {
    if (id) {
      dispatch(GetListingById(id));
      dispatch(getReviewsByListing(id));
    }
  }, [id, dispatch]);

  // Show loading state
  if (status === "loading") {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-xl text-gray-600">Loading listing details...</p>
      </div>
    );
  }

  const title = listing?.title || "Listing";
  const images = listing?.images || [];
  const city = listing?.address?.city;
  const country = listing?.address?.country;
  const maxGuests = listing?.maxGuests;
  const bedroomsCount = listing?.bedrooms;
  const bathroomsCount = listing?.bathrooms;
  const rating = listing?.ratingAvg || 0;
  const reviewsCount = Array.isArray(listing?.reviews)
    ? listing.reviews.length
    : 0;
  const hostName = listing?.hostId?.firstName
    ? `${listing.hostId.firstName} ${listing.hostId.lastName || ""}`.trim()
    : listing?.host?.name || "Host";
  const amenities = Array.isArray(listing?.amenities) ? listing.amenities : [];

  const bedroomsArr = Array.from({ length: bedroomsCount || 0 }).map(
    (_, i) => ({
      id: i + 1,
      title: `Bedroom ${i + 1}`,
      subtitle: "Comfortable bed",
      img: placeholderBedroomImg,
    })
  );

  return (
    <>
      <ListingGallery title={title} images={images} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 relative">
          {/*============= Left Side ================== */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Title & Info */}
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                {city && country
                  ? `Entire ${
                      listing?.propertyType || "place"
                    } in ${city}, ${country}`
                  : `Entire ${listing?.propertyType || "place"}`}
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                {[
                  maxGuests ? `${maxGuests} guests` : null,
                  bedroomsCount ? `${bedroomsCount} bedrooms` : null,
                  bathroomsCount
                    ? `${bathroomsCount} bathroom${
                        bathroomsCount > 1 ? "s" : ""
                      }`
                    : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>

            {/*  Highlights */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border rounded-lg p-4">
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <div className="flex items-center justify-center gap-3 sm:gap-5">
                  <GuestFavouriteIcon side="left" />
                  <div className="text-center font-semibold text-gray-800 w-12 sm:w-16 text-base sm:text-lg flex flex-col items-center">
                    <span className="m-0">Guest</span>
                    <span className="m-0">favourite</span>
                  </div>
                  <GuestFavouriteIcon side="right" />
                </div>

                <div className="text-sm sm:text-base">
                  One of the most loved homes on Airbnb, according to guests
                </div>
              </div>

              {/* ----------- rating -------------  */}
              <div className="text-center hidden sm:block">
                <p className="font-semibold text-gray-800 text-sm">
                  {rating.toFixed(1)} ★
                </p>
              </div>
              {/*---------- vertical line ------- */}
              <div className="h-9 border-l border-gray-300 hidden sm:block"></div>
              {/* ----------- Reviews -------------  */}
              <div className="text-center hidden sm:block">
                <p className="font-semibold text-gray-800 text-sm">
                  {reviewsCount}{" "}
                </p>
                <p>Reviews</p>
              </div>
            </div>

            {/* Host info */}
            <div className="flex items-center gap-3 sm:gap-4">
              <img
                src={
                  listing?.hostId?.avatar ||
                  listing?.host?.avatar ||
                  "https://randomuser.me/api/portraits/women/55.jpg"
                }
                alt="Host"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border"
              />
              <div>
                <p className="text-sm sm:text-base font-semibold">
                  Hosted by {hostName}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">Superhost</p>
              </div>
            </div>

            <hr />

            {/* Amenities */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Info className="text-gray-700 mt-1" />
                <div>
                  <p className="font-semibold">Outdoor entertainment</p>
                  <p className="text-sm text-gray-600">
                    The firepit, alfresco dining, BBQ area and outdoor seating
                    are great for summer trips.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="text-gray-700 mt-1" />
                <div>
                  <p className="font-semibold">Mountain and garden views</p>
                  <p className="text-sm text-gray-600">
                    Soak up the views during your stay.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="text-gray-700 mt-1" />
                <div>
                  <p className="font-semibold">Park for free</p>
                  <p className="text-sm text-gray-600">
                    This is one of the few places in the area with free parking.
                  </p>
                </div>
              </div>
            </div>

            <hr />

            {/* Description */}
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>{listing?.description}</p>
            </div>

            <div className="max-w-6xl mx-auto px-0 sm:px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
              {/* Where you'll sleep */}
              <section>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                  Where you'll sleep
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {bedroomsArr.map((b) => (
                    <Card
                      key={b.id}
                      className="shadow-sm rounded-lg overflow-hidden"
                    >
                      <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 items-start">
                        <div className="w-28 h-20 sm:w-40 sm:h-28 shrink-0 rounded-md overflow-hidden bg-gray-100">
                          <img
                            src={b.img}
                            alt={b.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm sm:text-base font-medium text-gray-900">
                            {b.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            {b.subtitle}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {(!bedroomsArr || bedroomsArr.length === 0) && (
                    <p className="text-gray-600">
                      Bedroom information not provided.
                    </p>
                  )}
                </div>
              </section>

              <hr />

              {/* What this place offers */}
              <section>
                <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
                  What this place offers
                </h3>
                <Amenity amenities={amenities} />
              </section>

              <hr />
              {/* repeat calendar date picker here */}
              {/* <DateSelector /> */}
            </div>
          </div>

          {/*============= Right Side for Booking ================== */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-10 flex flex-col gap-4 items-center">
              <BookingHome />
              <div className="text-gray-500 flex items-center gap-2 sm:gap-3 mt-4 cursor-pointer justify-center">
                <FlagOff size={16} className="sm:w-[18px] sm:h-[18px]" />
                <p className="underline underline-offset-1 font-semibold text-xs sm:text-[0.9rem]">
                  Report this listing
                </p>
              </div>
            </div>
          </div>
        </div>

        {/*================= Rating and Reviews Sections ================= */}
        <div className="max-w-5xl">
          <AverageRating reviews={reviews} />
          <ReviewsList reviews={reviews} />
        </div>
        {/*================= Location Section ================= */}
        <div className="max-w-5xl">
          <ListingLocation listing={listing} />
        </div>
        {/*================= Host Section ================= */}
        <div className="max-w-5xl">
          <ListingHost />
        </div>
      </div>
    </>
  );
};

export default ListingDetails;
