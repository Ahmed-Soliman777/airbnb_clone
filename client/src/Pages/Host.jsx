import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ServiceTypeSelection from "@/components/host/ServiceTypeSelection";
import HomeListingForm from "@/components/host/HomeListingForm";
import ExperienceListingForm from "@/components/host/ExperienceListingForm";
import ServiceListingForm from "@/components/host/ServiceListingForm";
import BecomeHostButton from "@/components/BecomeHostButton/BecomeHostButton";
import { getUserProfile } from "@/utils/userApi";
import { Button } from "@/components/ui/button";
import { Loader2, LayoutDashboard } from "lucide-react";

const Host = () => {

    const [selectedService, setSelectedService] = useState(null);
    const [isHost, setIsHost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkHostStatus();
    }, []);

    const checkHostStatus = async () => {
        try {
            const profileData = await getUserProfile();
            const userRole = profileData.role;
            setIsHost(userRole === 'host');
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            setIsHost(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleServiceSelect = (type) => {
        setSelectedService(type);
    };

    const handleBack = () => {
        setSelectedService(null);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isHost) {
        return (
            <div className="min-h-screen bg-linear-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
                <div className="max-w-2xl w-full bg-background rounded-2xl shadow-2xl p-8 md:p-12 text-center space-y-6">
                    <div className="space-y-3">
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                            Start Your Hosting Journey
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Share your spaces, experiences, or services with guests around the world
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 py-6">
                        <div className="space-y-2">
                            <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-2xl">🏠</span>
                            </div>
                            <h3 className="font-semibold">List Properties</h3>
                            <p className="text-sm text-muted-foreground">
                                Rent out your home, apartment, or room
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-2xl">🎨</span>
                            </div>
                            <h3 className="font-semibold">Host Experiences</h3>
                            <p className="text-sm text-muted-foreground">
                                Share unique activities and tours
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-2xl">🔧</span>
                            </div>
                            <h3 className="font-semibold">Offer Services</h3>
                            <p className="text-sm text-muted-foreground">
                                Provide professional services to guests
                            </p>
                        </div>
                    </div>

                    <BecomeHostButton className="w-full md:w-auto" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Dashboard Link for hosts */}
            {!selectedService && (
                <div className="container max-w-7xl mx-auto px-4 py-4">
                    <Link to="/host/dashboard">
                        <Button variant="outline" className="gap-2">
                            <LayoutDashboard className="w-4 h-4" />
                            View Dashboard
                        </Button>
                    </Link>
                </div>
            )}

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
