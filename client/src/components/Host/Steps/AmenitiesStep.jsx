import {
    Wifi,
    Tv,
    Coffee,
    Wind,
    Waves,
    Car,
    Dumbbell,
    UtensilsCrossed,
    Shirt,
    Flame,
} from "lucide-react";
import { Card } from "@/components/ui/card";

const amenitiesList = [
    { id: "wifi", label: "Wifi", icon: Wifi },
    { id: "tv", label: "TV", icon: Tv },
    { id: "kitchen", label: "Kitchen", icon: UtensilsCrossed },
    { id: "coffee", label: "Coffee maker", icon: Coffee },
    { id: "ac", label: "Air conditioning", icon: Wind },
    { id: "pool", label: "Pool", icon: Waves },
    { id: "parking", label: "Free parking", icon: Car },
    { id: "gym", label: "Gym", icon: Dumbbell },
    { id: "washer", label: "Washer", icon: Shirt },
    { id: "heating", label: "Heating", icon: Flame },
];

import React from 'react'

export default function AmenitiesStep({ data, onUpdate }) {

    const toggleAmenity = (amenityId) => {
        const currentAmenities = data.amenities || [];
        const newAmenities = currentAmenities.includes(amenityId)
            ? currentAmenities.filter((id) => id !== amenityId)
            : [...currentAmenities, amenityId];
        onUpdate({ amenities: newAmenities });
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
                    <Wifi className="w-8 h-8 text-accent-foreground" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                    What amenities do you offer?
                </h2>
                <p className="text-muted-foreground">
                    Select all amenities that apply to your property
                </p>
            </div>

            <div className="max-w-3xl mx-auto">
                <div className="grid md:grid-cols-2 gap-4">
                    {amenitiesList.map((amenity) => {
                        const Icon = amenity.icon;
                        const isSelected = data.amenities?.includes(amenity.id);

                        return (
                            <Card
                                key={amenity.id}
                                onClick={() => toggleAmenity(amenity.id)}
                                className={`p-4 cursor-pointer transition-all duration-300 ${isSelected
                                        ? "border-2 border-primary bg-accent"
                                        : "border-2 border-border"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon
                                        className={`w-6 h-6 ${isSelected
                                                ? "text-primary"
                                                : "text-muted-foreground"
                                            }`}
                                    />
                                    <span
                                        className={`font-medium ${isSelected ? "text-foreground" : "text-muted-foreground"
                                            }`}
                                    >
                                        {amenity.label}
                                    </span>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {data.amenities && data.amenities.length > 0 && (
                    <div className="mt-6 p-4 bg-accent rounded-lg">
                        <p className="text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">
                                {data.amenities.length}
                            </span>{" "}
                            amenities selected
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

