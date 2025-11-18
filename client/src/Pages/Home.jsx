import Amenity from "@/components/Listing/Amenity";
import AmenityExtractor from "@/components/Amenities/test";
import ListingCarousel from "@/components/Listing/ListingCarousel";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GetAllListings } from "@/store/Slices/listingSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { listings, status, error } = useSelector((state) => state.listing);

  useEffect(() => {
    if (status === "idle") {
      dispatch(GetAllListings());
    }
  }, [dispatch, status]);

  return (
    <div>
      <section className="w-10/12 py-10 relative mx-auto">
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
