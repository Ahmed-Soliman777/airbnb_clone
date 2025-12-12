import Amenity from "@/components/Listing/Amenity";
import AmenityExtractor from "@/components/Amenities/test";
import ListingCarousel from "@/components/Listing/ListingCarousel";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GetAllListings } from "@/store/Slices/listingSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { listings, status, error } = useSelector((state) => state.listing);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    if (status === "idle") {
      dispatch(GetAllListings());
    }
  }, [dispatch, status]);

  useEffect(() => {
    // Get recently viewed listings from localStorage
    const viewedListings = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    
    // Filter to get full listing objects from the viewed IDs
    if (status === "succeeded" && viewedListings.length > 0) {
      const recentListings = viewedListings
        .map(id => listings.find(listing => listing._id === id))
        .filter(Boolean) // Remove undefined entries
        .slice(0, 10); // Limit to 10 most recent
      setRecentlyViewed(recentListings);
    }
  }, [listings, status]);

  return (
    <div>
      {/* Recently Viewed Section */}
      {recentlyViewed.length > 0 && (
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
