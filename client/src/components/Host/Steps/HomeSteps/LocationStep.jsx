import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";

const LocationStep = ({ data, onUpdate }) => {
  const handleChange = (field, value) => {
    if (field === "lat" || field === "lng") {
      onUpdate({
        coordinates: {
          ...data.coordinates,
          [field]: parseFloat(value) || 0,
        },
      });
    } else {
      onUpdate({ [field]: value });
    }
  };

  const LocationPicker = ({ coordinates, onPick }) => {
    useMapEvents({
      click(e) {
        onPick({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
      },
    });
    if (!coordinates?.lat || !coordinates?.lng) return null;

    return <Marker position={[coordinates.lat, coordinates.lng]} />;
  }

  const position = data.coordinates?.lat && data.coordinates?.lng
    ? [data.coordinates.lat, data.coordinates.lng]
    : [30.0445, 31.24];
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-accent-foreground" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Where's your place located?
        </h2>
        <p className="text-muted-foreground">
          Guests will only get your exact address once they've booked
        </p>
      </div>

      <div className="space-y-4 max-w-xl mx-auto">
        <div>
          <Label htmlFor="street">Street Address</Label>
          <Input
            id="street"
            value={data.street || ""}
            onChange={(e) => handleChange("street", e.target.value)}
            placeholder="123 Main Street"
            className="mt-1.5"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={data.city || ""}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="San Francisco"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={data.country || ""}
              onChange={(e) => handleChange("country", e.target.value)}
              placeholder="United States"
              className="mt-1.5"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="lat">Latitude</Label>
            <Input
              id="lat"
              type="number"
              step="any"
              value={data.coordinates?.lat || ""}
              onChange={(e) => handleChange("lat", e.target.value)}
              placeholder="37.7749"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="lng">Longitude</Label>
            <Input
              id="lng"
              type="number"
              step="any"
              value={data.coordinates?.lng || ""}
              onChange={(e) => handleChange("lng", e.target.value)}
              placeholder="-122.4194"
              className="mt-1.5"
            />
          </div>
        </div>
        <div className="relative z-0">
          <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: "300px", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationPicker
              coordinates={data.coordinates}
              onPick={(coords) =>
                onUpdate({
                  coordinates: coords,
                })
              }
            />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default LocationStep;
