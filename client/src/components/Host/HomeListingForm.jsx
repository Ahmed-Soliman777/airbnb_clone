import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import StepIndicator from "./StepIndicator";
import LocationStep from "./steps/LocationStep";
import PricingStep from "./steps/PricingStep";
import PropertyDetailsStep from "./steps/PropertyDetailsStep";
import ImagesStep from "./steps/ImagesStep";
import AmenitiesStep from "./steps/AmenitiesStep";
import AvailabilityStep from "./steps/AvailabilityStep";
import { toast } from "sonner";

const steps = [
    "Location",
    "Pricing",
    "Property Details",
    "Images",
    "Amenities",
    "Availability",
];
import React from 'react'

export default function HomeListingForm({ onBack }) {

    const [currentStep, setCurrentStep] = useState(0);
    const [listingData, setListingData] = useState({
        coordinates: { lat: 0, lng: 0 },
        images: [],
        amenities: [],
        availability: [],
    });

    const updateListingData = (data) => {
        setListingData((prev) => ({ ...prev, ...data }));
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleSubmit = () => {
        console.log("Listing Data:", listingData);
        toast.success("Listing created successfully!");
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <LocationStep data={listingData} onUpdate={updateListingData} />
                );
            case 1:
                return (
                    <PricingStep data={listingData} onUpdate={updateListingData} />
                );
            case 2:
                return (
                    <PropertyDetailsStep
                        data={listingData}
                        onUpdate={updateListingData}
                    />
                );
            case 3:
                return (
                    <ImagesStep data={listingData} onUpdate={updateListingData} />
                );
            case 4:
                return (
                    <AmenitiesStep data={listingData} onUpdate={updateListingData} />
                );
            case 5:
                return (
                    <AvailabilityStep data={listingData} onUpdate={updateListingData} />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen">
            <div className="border-b bg-card">
                <div className="container max-w-4xl mx-auto px-4 py-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                </div>
            </div>

            <div className="container max-w-4xl mx-auto px-4 py-8">
                <StepIndicator steps={steps} currentStep={currentStep} />

                <div className="mt-8 mb-8">{renderStep()}</div>

                <div className="flex justify-between pt-6 border-t">
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentStep === 0}
                    >
                        Previous
                    </Button>
                    <Button onClick={handleNext}>
                        {currentStep === steps.length - 1 ? "Submit Listing" : "Next"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

