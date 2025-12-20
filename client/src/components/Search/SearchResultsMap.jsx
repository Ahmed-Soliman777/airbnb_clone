import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import { DollarSign } from "lucide-react";

// Fix for default marker icon issue in React-Leaflet
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const SearchResultsMap = ({ listings }) => {
  const navigate = useNavigate();

  // Filter listings with valid coordinates
  const listingsWithCoords = listings.filter(
    (listing) =>
      listing?.address?.coordinates?.lat && listing?.address?.coordinates?.lng
  );

  if (listingsWithCoords.length === 0) {
    return null; // Don't show map if no listings have coordinates
  }

  // Calculate center position (average of all coordinates)
  const avgLat =
    listingsWithCoords.reduce((sum, l) => sum + l.address.coordinates.lat, 0) /
    listingsWithCoords.length;
  const avgLng =
    listingsWithCoords.reduce((sum, l) => sum + l.address.coordinates.lng, 0) /
    listingsWithCoords.length;

  const center = [avgLat, avgLng];

  return (
    <div className="mb-6 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: "min(100vh, 600px)", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {listingsWithCoords.map((listing) => {
          const position = [
            listing.address.coordinates.lat,
            listing.address.coordinates.lng,
          ];

          return (
            <Marker key={listing._id} position={position}>
              <Popup>
                <div
                  className="text-sm cursor-pointer"
                  onClick={() => navigate(`/listing/${listing._id}`)}
                >
                  {listing.images?.[0] && (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                  )}
                  <p className="font-semibold text-gray-900 mb-1 hover:underline">
                    {listing.title}
                  </p>
                  <p className="text-xs text-gray-600 mb-2">
                    {listing.address?.city}, {listing.address?.country}
                  </p>
                  <div className="flex items-center gap-1 text-gray-900 font-semibold">
                    <DollarSign size={14} />
                    <span>${listing.price_per_night}</span>
                    <span className="text-gray-500 font-normal">/ night</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default SearchResultsMap;
