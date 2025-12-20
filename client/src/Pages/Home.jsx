import Amenity from "@/components/Listing/Amenity";
import AmenityExtractor from "@/components/Amenities/test";
import ListingCarousel from "@/components/Listing/ListingCarousel";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GetAllListings } from "@/store/Slices/listingSlice";
import { fetchRecentlyViewed } from "@/store/Slices/recentlyViewedSlice";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { listings, status, error } = useSelector((state) => state.listing);
  const user = useSelector((state) => state.auth.user);
  const recentlyViewed = useSelector((state) => state.recentlyViewed.items);

  useEffect(() => {
    if (status === "idle") {
      dispatch(GetAllListings());
    }
  }, [dispatch, status]);

  // Fetch recently viewed for logged-in users only
  useEffect(() => {
    console.log("User:", user);
    console.log("Recently Viewed Items:", recentlyViewed);

    if (user) {
      console.log("Fetching recently viewed...");
      dispatch(fetchRecentlyViewed());
    }
  }, [user, dispatch, recentlyViewed]);

  return (
    <div>
      {/* Recently Viewed Section - Only for logged-in users */}
      {user && recentlyViewed.length > 0 && (
        <section className="w-10/12 py-10 relative mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">{t("home.recentlyViewed")}</h2>
          </div>
          <ListingCarousel listings={recentlyViewed} cardSize="large" />
        </section>
      )}

      <section className="w-10/12 py-10 relative mx-auto">
        {/* Recently Viewed */}

        {/*--------------- Header for title ------------------- */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">{t("home.popularHomes")}</h2>
        </div>
        {status === "loading" && (
          <div className="flex flex-col justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-rose-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-lg text-gray-600">{t("home.loadingListings")}</p>
          </div>
        )}
        {status === "failed" && (
          <div className="flex justify-center items-center py-12">
            <p className="text-lg text-red-600 font-medium">{t("home.error")}: {error}</p>
          </div>
        )}
        {status === "succeeded" && <ListingCarousel listings={listings} />}
      </section>
    </div>
  );
};

export default Home;
