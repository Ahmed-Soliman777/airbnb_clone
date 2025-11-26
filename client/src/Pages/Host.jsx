import { useState } from "react";
import ExperienceListingForm from "@/components/Host/ExperienceListingForm";
import HomeListingForm from "@/components/Host/HomeListingForm";
import ServiceListingForm from "@/components/Host/ServiceListingForm";
import ServiceTypeSelection from "@/components/Host/ServiceTypeSelection";

const Host = () => {
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
            ) : selectedService === "experience" ? (
                <ExperienceListingForm onBack={handleBack} />
            ) : selectedService === "service" ? (
                <ServiceListingForm onBack={handleBack} />
            ) : null}
        </div>
    );
};

export default Host;
