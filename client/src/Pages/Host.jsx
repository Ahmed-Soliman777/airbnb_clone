import { useState } from "react";
import ServiceTypeSelection from "@/components/Host/ServiceTypeSelection";
import HomeListingForm from "@/components/Host/HomeListingForm";

export default function Host() {
    const [selectedService, setSelectedService] = useState(null);

    const handleServiceSelect = (type) => {
        setSelectedService(type);
    };

    const handleBack = () => {
        setSelectedService(null);
    };



    return (
        <div className="min-h-screen bg-background">
            {!selectedService ? (
                <ServiceTypeSelection onSelect={handleServiceSelect} />
            ) : selectedService === "home" ? (
                <HomeListingForm onBack={handleBack} />
            ) : (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-foreground mb-2">
                            Coming Soon
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            {selectedService === "experience" ? "Experience" : "Service"} listings
                            will be available soon.
                        </p>
                        <button
                            onClick={handleBack}
                            className="text-primary hover:underline"
                        >
                            Go back
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};