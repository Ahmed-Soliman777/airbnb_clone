import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin } from "lucide-react";

export default function ServiceLocationStep({ data, onUpdate }) {
    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-accent-foreground" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                    Where do you provide service?
                </h2>
                <p className="text-muted-foreground">
                    Define your service area
                </p>
            </div>

            <div className="space-y-4 max-w-xl mx-auto">
                <div>
                    <Label htmlFor="serviceArea">Service Area Description</Label>
                    <Textarea
                        id="serviceArea"
                        placeholder="e.g., All neighborhoods within 10 miles of downtown, or specific zip codes..."
                        value={data.serviceArea || ""}
                        onChange={(e) => onUpdate({ serviceArea: e.target.value })}
                        className="mt-1.5 min-h-[100px]"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="city">Primary City</Label>
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
                        <Label htmlFor="lat">Latitude (Optional)</Label>
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
                        <Label htmlFor="lng">Longitude (Optional)</Label>
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

                {data.serviceArea && data.city && data.country && (
                    <div className="p-4 bg-muted rounded-lg mt-6">
                        <h3 className="font-semibold text-foreground mb-2">Service Area</h3>
                        <p className="text-sm text-foreground mb-2">{data.serviceArea}</p>
                        <p className="text-sm text-muted-foreground">
                            {data.city}, {data.country}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
