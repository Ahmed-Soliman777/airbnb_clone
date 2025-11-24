import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";

export default function LocationStep({ data, onUpdate }) {

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
                        placeholder="123 Main Street"
                        value={data.street || ""}
                        onChange={(e) => onUpdate({ street: e.target.value })}
                        className="mt-1.5"
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                            id="city"
                            placeholder="San Francisco"
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

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="lat">Latitude</Label>
                        <Input
                            id="lat"
                            type="number"
                            step="any"
                            placeholder="37.7749"
                            value={data.coordinates?.lat || ""}
                            onChange={(e) =>
                                onUpdate({
                                    coordinates: {
                                        lat: parseFloat(e.target.value) || 0,
                                        lng: data.coordinates?.lng || 0,
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
                            step="any"
                            placeholder="-122.4194"
                            value={data.coordinates?.lng || ""}
                            onChange={(e) =>
                                onUpdate({
                                    coordinates: {
                                        lat: data.coordinates?.lat || 0,
                                        lng: parseFloat(e.target.value) || 0,
                                    },
                                })
                            }
                            className="mt-1.5"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};