import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";

export default function ExperienceLocationStep({ data, onUpdate }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-accent-foreground" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Where does your experience take place?
        </h2>
        <p className="text-muted-foreground">
          Help guests find your meeting point
        </p>
      </div>

      <div className="space-y-4 max-w-xl mx-auto">
        <div>
          <Label htmlFor="street">Meeting Point / Street Address</Label>
          <Input
            id="street"
            placeholder="123 Main Street or Landmark name"
            value={data.street || ""}
            onChange={(e) => onUpdate({ street: e.target.value })}
            className="mt-1.5"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="New York"
              value={data.city || ""}
              onChange={(e) => onUpdate({ city: e.target.value })}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              placeholder="United States"
              value={data.country || ""}
              onChange={(e) => onUpdate({ country: e.target.value })}
              className="mt-1.5"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="lat">Latitude</Label>
            <Input
              id="lat"
              type="number"
              step="0.000001"
              placeholder="40.7128"
              value={data.coordinates?.lat || ""}
              onChange={(e) =>
                onUpdate({
                  coordinates: {
                    ...data.coordinates,
                    lat: parseFloat(e.target.value) || 0,
                  },
                })
              }
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="lng">Longitude</Label>
            <Input
              id="lng"
              type="number"
              step="0.000001"
              placeholder="-74.0060"
              value={data.coordinates?.lng || ""}
              onChange={(e) =>
                onUpdate({
                  coordinates: {
                    ...data.coordinates,
                    lng: parseFloat(e.target.value) || 0,
                  },
                })
              }
              className="mt-1.5"
            />
          </div>
        </div>

        {data.street && data.city && data.country && (
          <div className="p-4 bg-muted rounded-lg mt-6">
            <h3 className="font-semibold text-foreground mb-2">Meeting Location</h3>
            <p className="text-sm text-foreground">{data.street}</p>
            <p className="text-sm text-muted-foreground">
              {data.city}, {data.country}
            </p>
            {data.coordinates?.lat !== 0 && data.coordinates?.lng !== 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                Coordinates: {data.coordinates.lat}, {data.coordinates.lng}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
