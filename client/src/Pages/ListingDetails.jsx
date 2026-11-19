import BookingHome from "@/components/BookingHome/BookingHome";
import { fetchListingBookedDates } from "@/store/Slices/bookingSlice";
import Amenity from "@/components/Listing/Amenity";
import AverageRating from "@/components/Listing/AverageRating";
import GuestFavouriteIcon from "@/components/Listing/GuestFavouriteIcon";
import ListingGallery from "@/components/Listing/ListingGallery";
import ListingHost from "@/components/Listing/ListingHost";
import ListingLocation from "@/components/Listing/ListingLocation";
import ReviewsList from "@/components/Listing/ReviewsList";
import StickyNavbar from "@/components/Listing/StickyNavbar";
import ReportListingDialog from "@/components/Listing/ReportListingDialog";
import { Calendar } from "@/components/ui/calendar";
import { GetListingById } from "@/store/Slices/listingSlice";
import { getReviewsByListing } from "@/store/Slices/reviewSlice";
import { addRecentlyViewed } from "@/store/Slices/recentlyViewedSlice";
import { addDays, differenceInDays, isBefore, isSameDay, isWithinInterval, subDays } from "date-fns";
import { FlagOff, Info, MapPin, Users } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";

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
  // Translation hook
  const { t } = useTranslation();

  // Get listing ID from URL params
  const { id } = useParams();
  const dispatch = useDispatch();

  // Get listing and reviews state from Redux store
  const { listing, status } = useSelector((state) => state.listing);
  const { reviews, statistics } = useSelector((state) => state.review);
  const { listingBookedDates } = useSelector((state) => state.booking);
  const user = useSelector((state) => state.auth.user);

  // Shared date state for calendar and booking component
  const [date, setDate] = useState(() => {
    // Load date from cookies on initial render
    const savedDate = document.cookie
      .split("; ")
      .find((row) => row.startsWith("listingDate="));

    if (savedDate) {
      try {
        const dateValue = JSON.parse(
          decodeURIComponent(savedDate.split("=")[1])
        );
        return {
          from: dateValue.from ? new Date(dateValue.from) : undefined,
          to: dateValue.to ? new Date(dateValue.to) : undefined,
        };
      } catch (e) {
        return { from: undefined, to: undefined };
      }
    }
    return { from: undefined, to: undefined };
  });

  // Sticky navbar state
  const [showStickyNav, setShowStickyNav] = useState(false);
  const [activeSection, setActiveSection] = useState("photos");
  const galleryRef = useRef(null);
  const photosRef = useRef(null);
  const amenitiesRef = useRef(null);
  const availabilityRef = useRef(null);
  const reviewsRef = useRef(null);
  const locationRef = useRef(null);

  // Report dialog state
  const [showReportDialog, setShowReportDialog] = useState(false);

  // Handle date selection from calendar
  const handleSelect = useCallback((range) => {
    if (!range?.from) {
      setDate({ from: undefined, to: undefined });
      // Clear cookie
      document.cookie = "listingDate=; path=/; max-age=0";
      return;
    }

    if (
      !range.to ||
      isSameDay(range.from, range.to) ||
      isBefore(range.to, range.from)
    ) {
      const newDate = { from: range.from, to: undefined };
      // Check if the selected date is valid (not booked)
      // This check is implicitly handled by disabled prop but good to have safety
      setDate(newDate);
      // Save to cookie
      document.cookie = `listingDate=${encodeURIComponent(
        JSON.stringify({ from: range.from.toISOString(), to: undefined })
      )}; path=/; max-age=86400`;
    } else {
      setDate(range);
      // Save to cookie (expires in 1 day)
      document.cookie = `listingDate=${encodeURIComponent(
        JSON.stringify({
          from: range.from.toISOString(),
          to: range.to.toISOString(),
        })
      )}; path=/; max-age=86400`;
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
    dispatch(fetchListingBookedDates(id));
  }, [id, dispatch]);

  // Track recently viewed listings (only for logged-in users)
  useEffect(() => {
    if (!id || !listing || !user) return;

    // User is logged in - save to database
    dispatch(addRecentlyViewed(id));
  }, [id, listing, user, dispatch]);

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
        { ref: availabilityRef, name: "availability" },
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
      availability: availabilityRef,
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
      <div className="flex justify-center items-center h-96">
        <div className="loader"></div>
      </div>
    );
  }

  // Show error state if no listing data
  if (!listingData) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-xl text-gray-600">
          {t("listingDetails.listingNotFound")}
        </p>
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
                  ? t("listingDetails.entirePlace", {
                    propertyType: listingData.propertyType,
                    city: listingData.city,
                    country: listingData.country,
                  })
                  : t("listingDetails.entirePlaceOnly", {
                    propertyType: listingData.propertyType,
                  })}
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                {[
                  listingData.maxGuests &&
                  `${listingData.maxGuests} ${t("listingDetails.guests")}`,
                  listingData.bedroomsCount &&
                  `${listingData.bedroomsCount} ${listingData.bedroomsCount > 1
                    ? t("listingDetails.bedrooms")
                    : t("listingDetails.bedroom")
                  }`,
                  listingData.bathroomsCount &&
                  `${listingData.bathroomsCount} ${listingData.bathroomsCount > 1
                    ? t("listingDetails.bathrooms")
                    : t("listingDetails.bathroom")
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
                    <span className="m-0">
                      {t("listingDetails.guestFavourite").split(" ")[0]}
                    </span>
                    <span className="m-0">
                      {t("listingDetails.guestFavourite").split(" ")[1]}
                    </span>
                  </div>
                  <GuestFavouriteIcon side="right" />
                </div>

                <div className="text-sm sm:text-base">
                  {t("listingDetails.guestFavouriteDesc")}
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
                <p>{t("listingDetails.reviews")}</p>
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
                  {t("listingDetails.hostedBy", {
                    hostName: listingData.hostName,
                  })}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  {t("listingDetails.superhost")}
                </p>
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
                    {t("listingDetails.whatThisPlaceOffers")}
                  </h3>
                  <Amenity amenities={listingData.amenities} />
                </section>
              )}

              <hr />
              {/* repeat calendar date picker */}
              <section ref={availabilityRef}>
                <h3 className="text-lg sm:text-xl font-semibold mb-4">
                  {nights > 0
                    ? t("listingDetails.night", { count: nights })
                    : t("listingDetails.selectCheckoutDate")}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {t("listingDetails.minimumStay", { count: 2 })}
                </p>
                <Calendar
                  mode="range"
                  numberOfMonths={2}
                  selected={date}
                  onSelect={handleSelect}
                  disabled={(day) => {
                    // Disable past dates
                    if (isBefore(day, addDays(new Date(), -1))) return true;

                    // Disable booked dates
                    if (listingBookedDates && listingBookedDates.length > 0) {
                      const isBooked = listingBookedDates.some((booking) =>
                        isWithinInterval(day, {
                          start: new Date(booking.from),
                          end: subDays(new Date(booking.to), 1),
                        })
                      );
                      if (isBooked) return true;
                    }

                    // Original logic for date selection constraints
                    return date?.from
                      ? isBefore(day, date.from) ||
                      isSameDay(day, addDays(date.from, 1))
                      : false;
                  }}
                  className="rounded-lg w-[80%]"
                />

                <div
                  className="text-md cursor-pointer underline mt-2 hover:bg-gray-100 w-max p-2 rounded-md text-align-left"
                  onClick={() => {
                    setDate(null);
                    // Clear cookie
                    document.cookie = "listingDate=; path=/; max-age=0";
                  }}
                >
                  {t("listingDetails.clearDates")}
                </div>
              </section>
            </div>
          </div>

          {/*============= Right Side for Booking ================== */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-10 flex flex-col gap-4 items-center">
              <BookingHome
                listing={listing}
                date={date}
                setDate={setDate}
                bookedDates={listingBookedDates}
              />
              <div
                className="text-gray-500 flex items-center gap-2 sm:gap-3 mt-4 cursor-pointer justify-center hover:text-gray-700 transition-colors"
                onClick={() => setShowReportDialog(true)}
              >
                <FlagOff size={16} className="sm:w-[18px] sm:h-[18px]" />
                <p className="underline underline-offset-1 font-semibold text-xs sm:text-[0.9rem]">
                  {t("listingDetails.reportThisListing")}
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
              <h2 className="text-2xl font-semibold mb-4">
                {t("listingDetails.noReviewsYet")}
              </h2>
              <p className="text-gray-600">
                {t("listingDetails.noReviewsDesc")}
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

      {/* Report Listing Dialog */}
      <ReportListingDialog
        open={showReportDialog}
        onOpenChange={setShowReportDialog}
        listingId={id}
        listingTitle={listingData?.title}
      />
    </>
  );
};

export default ListingDetails;
