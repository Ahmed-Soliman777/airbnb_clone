import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  MapPin,
  Users,
  Bed,
  Bath,
  DollarSign,
  SlidersHorizontal,
  X,
} from "lucide-react";
import "./SearchListing.css";

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
    <div className="search-listing-page">
      {/* Search Header */}
      <div className="search-header">
        <div className="search-info">
          <h1>{totalResults} Stays Found</h1>
          {filters.location_search && (
            <p className="search-location">
              <MapPin size={16} />
              {filters.location_search}
            </p>
          )}
        </div>

        <button
          className="filter-button"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal size={20} />
          Filters
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filters-header">
            <h2>Filters</h2>
            <button className="close-btn" onClick={() => setShowFilters(false)}>
              <X size={24} />
            </button>
          </div>

          <div className="filters-content">
            {/* Price Range */}
            <div className="filter-group">
              <h3>Price Range</h3>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min price"
                  value={filters.min_price}
                  onChange={(e) =>
                    handleFilterChange("min_price", e.target.value)
                  }
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max price"
                  value={filters.max_price}
                  onChange={(e) =>
                    handleFilterChange("max_price", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Property Type */}
            <div className="filter-group">
              <h3>Property Type</h3>
              <select
                value={filters.property_type_id}
                onChange={(e) =>
                  handleFilterChange("property_type_id", e.target.value)
                }
              >
                <option value="">All Types</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="cabin">Cabin</option>
                <option value="hotel">Hotel</option>
              </select>
            </div>

            {/* Rooms & Bathrooms */}
            <div className="filter-group">
              <h3>Rooms</h3>
              <div className="room-inputs">
                <div>
                  <label>Bedrooms</label>
                  <input
                    type="number"
                    min="0"
                    value={filters.min_bedrooms}
                    onChange={(e) =>
                      handleFilterChange("min_bedrooms", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label>Bathrooms</label>
                  <input
                    type="number"
                    min="0"
                    value={filters.min_bathrooms}
                    onChange={(e) =>
                      handleFilterChange("min_bathrooms", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Sort By */}
            <div className="filter-group">
              <h3>Sort By</h3>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              >
                <option value="recommended">Recommended</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="filters-footer">
            <button className="clear-btn" onClick={clearFilters}>
              Clear All
            </button>
            <button className="apply-btn" onClick={applyFilters}>
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Listings Grid */}
      <div className="listings-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Searching for perfect stays...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={fetchListings}>Try Again</button>
          </div>
        ) : listings.length === 0 ? (
          <div className="empty-state">
            <h2>No listings found</h2>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="listings-grid">
            {listings.map((listing) => (
              <div
                key={listing._id}
                className="listing-card"
                onClick={() => navigate(`/listing/${listing._id}`)}
              >
                <div className="listing-image">
                  <img
                    src={listing.images?.[0]?.url || "/placeholder.jpg"}
                    alt={listing.title}
                  />
                </div>

                <div className="listing-details">
                  <div className="listing-header">
                    <h3>{listing.title}</h3>
                    {listing.rating && (
                      <span className="rating">★ {listing.rating}</span>
                    )}
                  </div>

                  <p className="listing-type">{listing.propertyType}</p>

                  <div className="listing-specs">
                    {listing.maxGuests && (
                      <span>
                        <Users size={14} /> {listing.maxGuests} guests
                      </span>
                    )}
                    {listing.bedrooms && (
                      <span>
                        <Bed size={14} /> {listing.bedrooms} beds
                      </span>
                    )}
                    {listing.bathrooms && (
                      <span>
                        <Bath size={14} /> {listing.bathrooms} baths
                      </span>
                    )}
                  </div>

                  {listing.amenities && listing.amenities.length > 0 && (
                    <div className="listing-amenities">
                      {listing.amenities.slice(0, 3).map((amenity, idx) => (
                        <span key={idx} className="amenity-tag">
                          {amenity.name || amenity}
                        </span>
                      ))}
                      {listing.amenities.length > 3 && (
                        <span className="amenity-more">
                          +{listing.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  <div className="listing-price">
                    <span className="price">${listing.pricePerNight}</span>
                    <span className="period">/ night</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
