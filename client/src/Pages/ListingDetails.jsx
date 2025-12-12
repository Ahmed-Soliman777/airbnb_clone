import BookingHome from "@/components/BookingHome/BookingHome";
import Amenity from "@/components/Listing/Amenity";
import AverageRating from "@/components/Listing/AverageRating";
import GuestFavouriteIcon from "@/components/Listing/GuestFavouriteIcon";
import ListingGallery from "@/components/Listing/ListingGallery";
import ListingHost from "@/components/Listing/ListingHost";
import ListingLocation from "@/components/Listing/ListingLocation";
import ReviewsList from "@/components/Listing/ReviewsList";
import StickyNavbar from "@/components/Listing/StickyNavbar";
import { Calendar } from "@/components/ui/calendar";
import { GetListingById } from "@/store/Slices/listingSlice";
import { getReviewsByListing } from "@/store/Slices/reviewSlice";
import { addDays, differenceInDays, isBefore, isSameDay } from "date-fns";
import { FlagOff, Info, MapPin, Users } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

// const ICON_MAP = {
//   Info,
//   MapPin,
//   Users,
//   Home: Info,
//   Star: Info,
//   Heart: Info,
//   Key: Info,
//   Wifi: Info,
//   Car: Info,
//   Shield: Info,
// };

const ListingDetails = () => {
  // Get listing ID from URL params
  const { id } = useParams();
  const dispatch = useDispatch();

  // Get listing and reviews state from Redux store
  const { listing, status } = useSelector((state) => state.listing);
  const { reviews, statistics } = useSelector((state) => state.review);

  // Shared date state for calendar and booking component
  const [date, setDate] = useState({
    from: undefined,
    to: undefined,
  });

  // Sticky navbar state
  const [showStickyNav, setShowStickyNav] = useState(false);
  const [activeSection, setActiveSection] = useState("photos");
  const galleryRef = useRef(null);
  const photosRef = useRef(null);
  const amenitiesRef = useRef(null);
  const reviewsRef = useRef(null);
  const locationRef = useRef(null);

  // Handle date selection from calendar
  const handleSelect = useCallback((range) => {
    if (!range?.from) {
      setDate({ from: undefined, to: undefined });
      return;
    }

    if (
      !range.to ||
      isSameDay(range.from, range.to) ||
      isBefore(range.to, range.from)
    ) {
      setDate({ from: range.from, to: undefined });
    } else {
      setDate(range);
    }
  }, []);

  // Calculate number of nights
  const nights = useMemo(
    () => (date?.from && date?.to ? differenceInDays(date.to, date.from) : 0),
    [date?.from, date?.to]
  );

  // Fetch listing and reviews on component mount
  useEffect(() => {
    if (!id) return;
    dispatch(GetListingById(id));
    dispatch(getReviewsByListing(id));
  }, [id, dispatch]);

  // Handle scroll for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      if (galleryRef.current) {
        const galleryBottom = galleryRef.current.getBoundingClientRect().bottom;
        setShowStickyNav(galleryBottom < 0);
      }

      // Determine active section based on scroll position
      const sections = [
        { ref: photosRef, name: "photos" },
        { ref: amenitiesRef, name: "amenities" },
        { ref: reviewsRef, name: "reviews" },
        { ref: locationRef, name: "location" },
      ];

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section.name);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to section
  const scrollToSection = (sectionId) => {
    const refMap = {
      photos: photosRef,
      amenities: amenitiesRef,
      reviews: reviewsRef,
      location: locationRef,
    };
    const ref = refMap[sectionId];
    if (ref?.current) {
      const yOffset = -100;
      const y =
        ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Memoize derived data to prevent recalculation on every render
  const listingData = useMemo(() => {
    if (!listing) return null;

    return {
      title: listing.title || "Listing",
      images: listing.images || [],
      city: listing.address?.city,
      country: listing.address?.country,
      maxGuests: listing.maxGuests,
      bedroomsCount: listing.bedrooms,
      bathroomsCount: listing.bathrooms,
      rating: listing.ratingAvg || 0,
      reviewsCount: Array.isArray(reviews) ? reviews.length : 0,
      hostName: listing.hostId?.firstName
        ? `${listing.hostId.firstName} ${listing.hostId.lastName || ""}`.trim()
        : listing.host?.name || "Host",
      hostAvatar:
        listing.hostId?.avatar ||
        listing.host?.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          listing.hostId?.firstName || listing.host?.name || "H"
        )}&background=random`,
      amenities: Array.isArray(listing.amenities) ? listing.amenities : [],
      propertyType: listing.propertyType || "place",
      description: listing.description,
    };
  }, [listing, reviews]);

  // Show loading state
  if (status === "loading") {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-xl text-gray-600">Loading listing details...</p>
      </div>
    );
  }

  // Show error state if no listing data
  if (!listingData) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-xl text-gray-600">Listing not found.</p>
      </div>
    );
  }

  return (
    <>
      <StickyNavbar
        show={showStickyNav}
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />

      <div ref={galleryRef}>
        <ListingGallery
          title={listingData.title}
          images={listingData.images}
          description={listingData.description}
        />
      </div>
      <div
        ref={photosRef}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 relative">
          {/* Left Side: listing details */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Title & Info */}
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                {listingData.city && listingData.country
                  ? `Entire ${listingData.propertyType} in ${listingData.city}, ${listingData.country}`
                  : `Entire ${listingData.propertyType}`}
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                {[
                  listingData.maxGuests && `${listingData.maxGuests} guests`,
                  listingData.bedroomsCount &&
                    `${listingData.bedroomsCount} bedrooms`,
                  listingData.bathroomsCount &&
                    `${listingData.bathroomsCount} bathroom${
                      listingData.bathroomsCount > 1 ? "s" : ""
                    }`,
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
                  {listingData.rating.toFixed(1)} ★
                </p>
              </div>
              {/*---------- vertical line ------- */}
              <div className="h-9 border-l border-gray-300 hidden sm:block"></div>
              {/* ----------- Reviews -------------  */}
              <div className="text-center hidden sm:block">
                <p className="font-semibold text-gray-800 text-sm">
                  {listingData.reviewsCount}
                </p>
                <p>Reviews</p>
              </div>
            </div>

            {/* Host info */}
            <div className="flex items-center gap-3 sm:gap-4">
              <img
                src={listingData.hostAvatar}
                alt="Host"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border"
              />
              <div>
                <p className="text-sm sm:text-base font-semibold">
                  Hosted by {listingData.hostName}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">Superhost</p>
              </div>
            </div>

            <hr />

            {/* Description */}
            {listingData.description && (
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>{listingData.description}</p>
              </div>
            )}

            <div className="max-w-6xl mx-auto px-0 sm:px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
              {/* Where you'll sleep */}
              {/* <section>
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
              </section> */}

              <hr />

              {/* What this place offers */}
              {listingData.amenities.length > 0 && (
                <section ref={amenitiesRef}>
                  <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
                    What this place offers
                  </h3>
                  <Amenity amenities={listingData.amenities} />
                </section>
              )}

              <hr />
              {/* repeat calendar date picker */}
              <section>
                <h3 className="text-lg sm:text-xl font-semibold mb-4">
                  {nights > 0
                    ? `${nights} night${nights > 1 ? "s" : ""}`
                    : "Select checkout date"}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Minimum stay: 2 nights
                </p>
                <Calendar
                  mode="range"
                  numberOfMonths={2}
                  selected={date}
                  onSelect={handleSelect}
                  disabled={(day) =>
                    date?.from
                      ? isBefore(day, date.from) ||
                        isSameDay(day, addDays(date.from, 1))
                      : false
                  }
                  className="rounded-lg w-[80%]"
                />

                <div
                  className="text-md cursor-pointer underline mt-2 hover:bg-gray-100 w-max p-2 rounded-md text-align-left"
                  onClick={() => setDate(null)}
                >
                  Clear dates
                </div>
              </section>
            </div>
          </div>

          {/*============= Right Side for Booking ================== */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-10 flex flex-col gap-4 items-center">
              <BookingHome
                date={date}
                setDate={setDate}
                handleSelect={handleSelect}
              />
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
        <div ref={reviewsRef} className="max-w-5xl mt-12">
          <hr className="mb-8" />
          {reviews && reviews.length > 0 ? (
            <>
              <AverageRating reviews={reviews} statistics={statistics} />
              <ReviewsList reviews={reviews} />
            </>
          ) : (
            <div className="py-8">
              <h2 className="text-2xl font-semibold mb-4">No reviews yet</h2>
              <p className="text-gray-600">
                This listing doesn't have any reviews yet. Be the first to leave
                a review!
              </p>
            </div>
          )}
        </div>
        {/*================= Location Section ================= */}
        <div ref={locationRef} className="max-w-5xl">
          <ListingLocation listing={listing} />
        </div>
        {/*================= Host Section ================= */}
        <div className="max-w-5xl mb-40">
          <ListingHost listing={listing} />
        </div>
      </div>
    </>
  );
};

export default ListingDetails;
