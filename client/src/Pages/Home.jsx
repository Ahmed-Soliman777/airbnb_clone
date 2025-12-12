import Amenity from "@/components/Listing/Amenity";
import AmenityExtractor from "@/components/Amenities/test";
import ListingCarousel from "@/components/Listing/ListingCarousel";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GetAllListings } from "@/store/Slices/listingSlice";
import { fetchRecentlyViewed } from "@/store/Slices/recentlyViewedSlice";

const Home = () => {
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
  }, [user, dispatch]);

  return (
    <div>
      {/* Recently Viewed Section - Only for logged-in users */}
      {user && recentlyViewed.length > 0 && (
        <section className="w-10/12 py-10 relative mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Recently Viewed</h2>
          </div>
          <ListingCarousel listings={recentlyViewed} cardSize="large" />
        </section>
      )}

      <section className="w-10/12 py-10 relative mx-auto">
        {/* Recently Viewed */}

        {/*--------------- Header for title ------------------- */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Popular homes in Cairo</h2>
        </div>
        {status === "loading" && <p>Loading listings...</p>}
        {status === "failed" && <p>Error: {error}</p>}
        {status === "succeeded" && <ListingCarousel listings={listings} />}
      </section>
      {/* <Amenity /> */}

      {/* <AmenityExtractor /> */}
    </div>
  );
};

export default Home;
