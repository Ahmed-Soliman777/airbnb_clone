import BookingHome from "@/components/BookingHome/BookingHome";
import Amenity from "@/components/Listing/Amenity";
import GuestFavouriteIcon from "@/components/Listing/GuestFavouriteIcon";
import ListingGallery from "@/components/Listing/ListingGallery";
import ListingRate from "@/components/Listing/ListingRate";
import ListingReviews from "@/components/Listing/ListingReviews";
import { Card } from "@/components/ui/card";
import { GetListingById } from "@/store/Slices/listingSlice";
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

  useEffect(() => {
    if (id) dispatch(GetListingById(id));
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
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/*============= Left Side ================== */}
          <div className="md:col-span-2 space-y-6">
            {/* Title & Info */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {city && country
                  ? `Entire ${
                      listing?.propertyType || "place"
                    } in ${city}, ${country}`
                  : `Entire ${listing?.propertyType || "place"}`}
              </h2>
              <p className="text-gray-600">
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
            <div className="flex items-center justify-between gap-4 border rounded-lg p-4">
              <div className="flex items-center gap-3 ">
                <div className="flex items-center justify-center gap-5">
                  <GuestFavouriteIcon side="left" />
                  <div className="text-center font-semibold text-gray-800 w-16 text-lg flex flex-col items-center">
                    <span className="m-0">Guest</span>
                    <span className="m-0">favourite</span>
                  </div>
                  <GuestFavouriteIcon side="right" />
                </div>

                <div>
                  One of the most loved homes on Airbnb, according to guests
                </div>
              </div>

              {/* ----------- rating -------------  */}
              <div className="text-center ">
                <p className="font-semibold text-gray-800 text-sm">
                  {rating.toFixed(1)} ★
                </p>
              </div>
              {/*---------- vertical line ------- */}
              <div className="h-9 border-l border-gray-300"></div>
              {/* ----------- Reviews -------------  */}
              <div className=" text-center">
                <p className="font-semibold text-gray-800 text-sm">
                  {reviewsCount}{" "}
                </p>
                <p>Reviews</p>
              </div>
            </div>

            {/* Host info */}
            <div className="flex items-center gap-4">
              <img
                src={
                  listing?.hostId?.avatar ||
                  listing?.host?.avatar ||
                  "https://randomuser.me/api/portraits/women/55.jpg"
                }
                alt="Host"
                className="w-12 h-12 rounded-full border"
              />
              <div>
                <p className="font-semibold">Hosted by {hostName}</p>
                <p className="text-sm text-gray-500">Superhost</p>
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

            <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
              {/* Where you'll sleep */}
              <section>
                <h3 className="text-xl font-semibold mb-4">
                  Where you'll sleep
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {bedroomsArr.map((b) => (
                    <Card
                      key={b.id}
                      className="shadow-sm rounded-lg overflow-hidden"
                    >
                      <div className="flex gap-4 p-4 items-start">
                        <div className="w-40 h-28 shrink-0 rounded-md overflow-hidden bg-gray-100">
                          <img
                            src={b.img}
                            alt={b.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {b.title}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
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
                <h3 className="text-xl font-semibold mb-6">
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
          <div className="md:col-span-1 ">
            <div className="sticky top-10 flex flex-col gap-4 items-center">
              <BookingHome />
              <div className="text-gray-500 flex items-center gap-3 mt-4 cursor-pointer ">
                <FlagOff size={18} />
                <p className="underline underline-offset-1 font-semibold text-[0.9rem]">
                  Report this listing
                </p>
              </div>
            </div>
          </div>
        </div>

        {/*================= Rating and Reviews Sections ================= */}
        <div>
          <ListingRate />
          <ListingReviews />
        </div>
        {/*================= Location Section ================= */}
        <div className="listing-location"> location details here</div>
      </div>
    </>
  );
};

export default ListingDetails;
