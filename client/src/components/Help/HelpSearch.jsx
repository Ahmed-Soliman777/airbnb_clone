import React from 'react';
import { Search } from "lucide-react";
// import { useNavigate } from "react-router-dom";


const HelpSearch = () => {
// const handelsearch = () => {

// }
  return (
    <section className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Hi, how can we help?
        </h1>
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search how-tos and more"
            className="w-full px-6 py-4 pl-12 pr-32 rounded-full border border-gray-300 text-lg"
          />
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          />
          <button
            style={{ backgroundColor: "#FF385C" }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white px-6 py-2 rounded-full cursor-pointer"
          >
            Search
          </button>
        </div>
      </div>
    </section>
  );
};

export default HelpSearch;
