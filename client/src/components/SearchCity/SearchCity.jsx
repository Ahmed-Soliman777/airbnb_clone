import React from "react";
import { useSelector } from "react-redux";

export default function SearchCity({ whereInput, onSelectCity }) {
  const listings = useSelector((state) => state.listing.listings || []);

  // Extract unique cities safely
  const uniqueCities = [
    ...new Set(listings.map((item) => item?.address?.city).filter(Boolean)),
  ];

  // Filter cities only if whereInput has text
  const filteredCities =
    whereInput && whereInput.trim() !== ""
      ? uniqueCities.filter((city) =>
          city.toLowerCase().includes(whereInput.toLowerCase())
        )
      : uniqueCities; // show all cities if input is empty

  return (
    <ul className="bg-white p-4 rounded-2xl w-50 shadow-lg max-h-60 overflow-y-auto">
      {filteredCities.length > 0 ? (
        filteredCities.map((city) => (
          <li
            key={city}
            className="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer rounded-lg"
            onClick={() => onSelectCity(city)}
          >
            {city}
          </li>
        ))
      ) : (
        <li className="p-2 text-gray-400">No cities found</li>
      )}
    </ul>
  );
}
