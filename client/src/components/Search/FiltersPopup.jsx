import { X } from "lucide-react";

export default function FiltersPopup({
  showFilters,
  setShowFilters,
  filters,
  handleFilterChange,
  applyFilters,
  clearFilters,
  totalResults,
}) {
  if (!showFilters) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-gray-900 opacity-40 z-999"
        onClick={() => setShowFilters(false)}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-[600px] max-h-[90vh] bg-white rounded-4xl shadow-2xl z-1000 flex flex-col animate-scaleIn">
        <div className="flex justify-between items-center px-6 py-2 border-b border-gray-200">
          <h2 className="text-l font-semibold text-center w-full">Filters</h2>
          <button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setShowFilters(false)}
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mb-8 border-b-2 pb-2">
            <h3 className="text-base font-semibold mb-4 text-gray-900 ">
              Recommended for you
            </h3>
          </div>

          {/* type of place */}
          <div className="mb-8 border-b-2 pb-2">
            <h3 className="text-base font-semibold mb-4 text-gray-900">
              Type of Place
            </h3>

            <div className="flex border rounded-2xl">
              <button
                onClick={() => handleFilterChange("property_type_id", "house")}
                className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  filters.property_type_id === "house"
                    ? "border border-gray-900 bg-gray-100"
                    : "hover:bg-gray-100"
                }`}
              >
                Any type
              </button>
              <button
                onClick={() =>
                  handleFilterChange("property_type_id", "apartment")
                }
                className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  filters.property_type_id === "apartment"
                    ? "border border-gray-900 bg-gray-100"
                    : "hover:bg-gray-100"
                }`}
              >
                Room
              </button>
              <button
                onClick={() => handleFilterChange("property_type_id", "villa")}
                className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  filters.property_type_id === "villa"
                    ? "border border-gray-900 bg-gray-100"
                    : "hover:bg-gray-100"
                }`}
              >
                Entire place
              </button>
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-8">
            <h3 className="text-base font-semibold mb-4 text-gray-900">
              Price Range
            </h3>
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="Min price"
                value={filters.min_price}
                onChange={(e) =>
                  handleFilterChange("min_price", e.target.value)
                }
                className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-900 transition-colors"
              />
              <span className="text-gray-500 text-sm">to</span>
              <input
                type="number"
                placeholder="Max price"
                value={filters.max_price}
                onChange={(e) =>
                  handleFilterChange("max_price", e.target.value)
                }
                className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-900 transition-colors"
              />
            </div>
          </div>

          {/* Rooms & Bathrooms */}
          <div className="mb-8 border-b-2 pb-2">
            <h3 className="text-base font-semibold mb-4 text-gray-900">
              Rooms
            </h3>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm mb-2 text-gray-500">
                  Bedrooms
                </label>
                <input
                  type="number"
                  min="0"
                  value={filters.min_bedrooms}
                  onChange={(e) =>
                    handleFilterChange("min_bedrooms", e.target.value)
                  }
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-900 transition-colors"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm mb-2 text-gray-500">
                  Bathrooms
                </label>
                <input
                  type="number"
                  min="0"
                  value={filters.min_bathrooms}
                  onChange={(e) =>
                    handleFilterChange("min_bathrooms", e.target.value)
                  }
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-900 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Sort By */}
          <div className="mb-8">
            <h3 className="text-base font-semibold mb-4 text-gray-900">
              Sort By
            </h3>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-900 transition-colors"
            >
              <option value="recommended">Recommended</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-5 border-t border-gray-200 justify-between">
          <button
            className="px-3 py-3.5 rounded-lg text-sm font-semibold hover:bg-gray-50 cursor-pointer transition-all duration-200"
            onClick={clearFilters}
          >
            Clear All
          </button>
          <button
            className=" px-3 py-3.5 rounded-lg text-sm font-semibold bg-gray-900 border border-gray-900 text-white hover:bg-black cursor-pointer transition-all duration-200"
            onClick={applyFilters}
          >
            show {totalResults} places
          </button>
        </div>
      </div>
    </>
  );
}
