import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Home, Users, Bed, Bath } from "lucide-react";

export default function PropertyDetailsStep({ data, onUpdate }) {

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">    
                    <Home className="w-8 h-8 text-accent-foreground" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                    Share some basics about your place
                </h2>
                <p className="text-muted-foreground">
                    Help guests understand what you're offering
                </p>
            </div>

            <div className="space-y-6 max-w-xl mx-auto">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="maxGuests" className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Maximum Guests
                        </Label>
                        <Input
                            id="maxGuests"
                            type="number"
                            min="1"
                            placeholder="4"
                            value={data.maxGuests || ""}
                            onChange={(e) =>
                                onUpdate({ maxGuests: parseInt(e.target.value) || 0 })
                            }
                            className="mt-1.5"
                        />
                    </div>

                    <div>
                        <Label htmlFor="bedrooms" className="flex items-center gap-2">
                            <Bed className="w-4 h-4" />
                            Bedrooms
                        </Label>
                        <Input
                            id="bedrooms"
                            type="number"
                            min="0"
                            placeholder="2"
                            value={data.bedrooms || ""}
                            onChange={(e) =>
                                onUpdate({ bedrooms: parseInt(e.target.value) || 0 })
                            }
                            className="mt-1.5"
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="bathrooms" className="flex items-center gap-2">
                        <Bath className="w-4 h-4" />
                        Bathrooms
                    </Label>
                    <Input
                        id="bathrooms"
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder="1.5"
                        value={data.bathrooms || ""}
                        onChange={(e) =>
                            onUpdate({ bathrooms: parseFloat(e.target.value) || 0 })
                        }
                        className="mt-1.5"
                    />
                    <p className="text-sm text-muted-foreground mt-1.5">
                        Use decimals for half bathrooms (e.g., 1.5)
                    </p>
                </div>

                {data.maxGuests && data.bedrooms && data.bathrooms && (
                    <div className="mt-6 p-4 bg-accent rounded-lg">
                        <h3 className="font-semibold text-foreground mb-3">Your property</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Sleeps</span>
                                <span className="text-foreground font-medium">
                                    {data.maxGuests} guests
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Bedrooms</span>
                                <span className="text-foreground font-medium">
                                    {data.bedrooms}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Bathrooms</span>
                                <span className="text-foreground font-medium">
                                    {data.bathrooms}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};