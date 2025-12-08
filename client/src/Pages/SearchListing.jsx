import axios from "axios";
import { Bath, Bed, MapPin, SlidersHorizontal, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FiltersPopup from "../components/Search/FiltersPopup";
import ListingCard from "../components/Listing/ListingCard";

export default function SearchListing() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Search results state
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    address: searchParams.get("address") || "",
    location_search: searchParams.get("location_search") || "",
    checkin: searchParams.get("checkin") || "",
    checkout: searchParams.get("checkout") || "",
    adults: searchParams.get("adults") || "0",
    children: searchParams.get("children") || "0",
    infants: searchParams.get("infants") || "0",
    pets: searchParams.get("pets") || "0",
    min_price: searchParams.get("min_price") || "",
    max_price: searchParams.get("max_price") || "",
    property_type_id: searchParams.get("property_type_id") || "",
    min_bedrooms: searchParams.get("min_bedrooms") || "",
    min_bathrooms: searchParams.get("min_bathrooms") || "",
    amenities: searchParams.get("amenities") || "",
    sortBy: searchParams.get("sortBy") || "recommended",
    date_picker_type: searchParams.get("date_picker_type") || "regular",
  });

  // Fetch listings based on search params
  useEffect(() => {
    fetchListings();
  }, [searchParams]);

  const fetchListings = async () => {
    setLoading(true);
    setError(null);

    try {
      // Build query string from search params
      const queryString = searchParams.toString();
      const response = await axios.get(`/api/listings/search?${queryString}`);

      setListings(response.data.items || []);
      setTotalResults(response.data.search_metadata?.total_results || 0);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch listings");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "0" && value !== "") {
        params.set(key, value);
      }
    });

    navigate(`/search?${params.toString()}`);
    setShowFilters(false);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      address: "",
      location_search: "",
      checkin: "",
      checkout: "",
      adults: "0",
      children: "0",
      infants: "0",
      pets: "0",
      min_price: "",
      max_price: "",
      property_type_id: "",
      min_bedrooms: "",
      min_bathrooms: "",
      amenities: "",
      sortBy: "recommended",
      date_picker_type: "regular",
    });
  };

  // Calculate total guests
  const totalGuests =
    parseInt(filters.adults || 0) +
    parseInt(filters.children || 0) +
    parseInt(filters.infants || 0);

  return (
    <div className="max-w-[1440px] mx-auto px-5 py-5 min-h-screen">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-200 gap-4">
        <div className="search-info">
          <h1 className="text-2xl font-semibold mb-2 text-gray-900">
            {totalResults} Stays Found
          </h1>
          {filters.location_search && (
            <p className="flex items-center gap-1.5 text-gray-500 text-sm">
              <MapPin size={16} />
              {filters.location_search}
            </p>
          )}
        </div>

        <button
          className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 hover:border-gray-900 cursor-pointer text-sm font-medium transition-all duration-200"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal size={20} />
          Filters
        </button>
      </div>

      {/* Filters Popup */}
      <FiltersPopup
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        filters={filters}
        handleFilterChange={handleFilterChange}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
        totalResults={totalResults}
      />

      {/* Listings Grid */}
      <div className="mt-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 px-5 text-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 text-base">
              Searching for perfect stays...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 px-5 text-center">
            <p className="text-red-600 text-base mb-4">{error}</p>
            <button
              onClick={fetchListings}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg cursor-pointer text-sm font-medium hover:bg-black"
            >
              Try Again
            </button>
          </div>
        ) : listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-5 text-center">
            <h2 className="text-2xl font-semibold mb-3 text-gray-900">
              No listings found
            </h2>
            <p className="text-gray-500 text-base">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
