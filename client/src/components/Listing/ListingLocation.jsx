import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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

const ListingLocation = ({ listing }) => {
  // Extract location data from listing based on database schema
  // Database uses: address.coordinates.lat and address.coordinates.lng
  const latitude = listing?.address?.coordinates?.lat;
  const longitude = listing?.address?.coordinates?.lng;
  const city = listing?.address?.city || "Location";
  const country = listing?.address?.country || "";
  const streetAddress = listing?.address?.street || "";

  // Check if coordinates are available
  const hasCoordinates = latitude && longitude;

  // Default position (New York City) if coordinates not available
  const position = hasCoordinates ? [latitude, longitude] : [40.7128, -74.006];

  return (
    <div className="py-6 sm:py-8">
      <h3 className="text-lg sm:text-xl font-semibold mb-4">Where you'll be</h3>

      {hasCoordinates ? (
        <>
          <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm mb-4">
            <MapContainer
              center={position}
              zoom={13}
              scrollWheelZoom={false}
              style={{ height: "400px", width: "100%" }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position}>
                <Popup>
                  <div className="text-sm">
                    <p className="font-semibold">{city}</p>
                    {streetAddress && (
                      <p className="text-gray-600">{streetAddress}</p>
                    )}
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-gray-900">
              {city}
              {country ? `, ${country}` : ""}
            </p>
            {streetAddress && (
              <p className="text-sm text-gray-600">{streetAddress}</p>
            )}
            <p className="text-sm text-gray-600 mt-4">
              Exact location information is provided after booking is confirmed.
            </p>
          </div>
        </>
      ) : (
        <div className="space-y-2">
          <p className="font-semibold text-gray-900">
            {city}
            {country ? `, ${country}` : ""}
          </p>
          {streetAddress && (
            <p className="text-sm text-gray-600">{streetAddress}</p>
          )}
          <p className="text-sm text-gray-500 mt-4">
            Map coordinates are not available for this listing.
          </p>
        </div>
      )}
    </div>
  );
};

export default ListingLocation;
