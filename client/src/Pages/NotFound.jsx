import React from "react";
import Logo from "../assets/Airbnb-Logo.wine.svg"

const NotFound = () => {
  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      {/* Logo */}
      <div className="w-32 md:w-40 lg:w-48">
        <img
          src={Logo}
          alt="Airbnb Logo"
          
        />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between px-10 md:px-24 mt-10">
        {/* LEFT TEXT BLOCK */}
        <div className="max-w-xl">
          <h1 className="text-[125px] md:text-[120px] font-extrabold text-gray-800">
            Oops!
          </h1>

          <p className="text-[22px] text-gray-700 mt-4">
            We can't seem to find the page you're looking for.
          </p>

          <p className="text-gray-500 mt-2">Error code: 404</p>

          <div className="flex flex-col mt-6 space-y-1 text-green-700 text-sm">
            <a href="/">Home</a>
            <a href="/search">Search</a>
            <a href="/help">Help</a>
            <a href="/travel">Traveling on Airbnb</a>
            <a href="/hosting">Hosting on Airbnb</a>
            <a href="/trust">Trust & Safety</a>
            <a href="/sitemap">Sitemap</a>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="mt-10 md:mt-0">
          <img src="/404-Airbnb_final-gif.gif" alt="404 Illustration" />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
