import Amenity from "@/components/Amenities/Amenity";
import ListingCarousel from "@/components/Listing/ListingCarousel";
import React from "react";

const Home = () => {
  return (
    <div>
      <section className="w-10/12 py-10 relative mx-auto">
        {/*--------------- Header for title ------------------- */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Popular homes in Cairo</h2>
        </div>
        <ListingCarousel />
      </section>
      {/* <Amenity /> */}
    </div>
  );
};

export default Home;
