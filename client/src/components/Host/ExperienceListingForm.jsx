import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createExperience } from "@/store/Slices/experienceSlice";
import { toast } from "sonner";
import ExperienceBasicDetailsStep from "./Steps/ExperienceSteps/ExperienceBasicDetailsStep";
import ExperienceLocationStep from "./Steps/ExperienceSteps/ExperienceLocationStep";
import ExperiencePricingStep from "./Steps/ExperienceSteps/ExperiencePricingStep";
import ExperienceScheduleStep from "./Steps/ExperienceSteps/ExperienceScheduleStep";
import ExperienceRequirementsStep from "./Steps/ExperienceSteps/ExperienceRequirementsStep";
import ExperienceImagesStep from "./Steps/ExperienceSteps/ExperienceImagesStep";
import ExperienceInclusionsStep from "./Steps/ExperienceSteps/ExperienceInclusionsStep";
import StepIndicator from "./StepIndicator";

const steps = [
    "Basic Details",
    "Location",
    "Pricing",
    "Schedule",
    "Requirements",
    "Images",
    "What's Included",
];

const ExperienceListingForm = ({ onBack }) => {
    const dispatch = useDispatch();
    const { status } = useSelector((state) => state.experience);
    const [currentStep, setCurrentStep] = useState(0);
    const [listingData, setListingData] = useState({
        title: "",
        description: "",
        experienceType: "",
        street: "",
        city: "",
        country: "",
        coordinates: { lat: 0, lng: 0 },
        pricePerPerson: 0,
        duration: "",
        groupSize: { min: 1, max: 10 },
        schedule: [],
        ageRequirement: "",
        fitnessLevel: "",
        requirements: [],
        images: [],
        inclusions: [],
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

    const handleSubmit = async () => {
        try {
            await dispatch(createExperience(listingData)).unwrap();
            toast.success("Experience listing created successfully!");
            onBack();
        } catch (error) {
            toast.error(error || "Failed to create experience listing");
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <ExperienceBasicDetailsStep
                        data={listingData}
                        onUpdate={updateListingData}
                    />
                );
            case 1:
                return (
                    <ExperienceLocationStep
                        data={listingData}
                        onUpdate={updateListingData}
                    />
                );
            case 2:
                return (
                    <ExperiencePricingStep data={listingData} onUpdate={updateListingData} />
                );
            case 3:
                return (
                    <ExperienceScheduleStep
                        data={listingData}
                        onUpdate={updateListingData}
                    />
                );
            case 4:
                return (
                    <ExperienceRequirementsStep data={listingData} onUpdate={updateListingData} />
                );
            case 5:
                return (
                    <ExperienceImagesStep data={listingData} onUpdate={updateListingData} />
                );
            case 6:
                return (
                    <ExperienceInclusionsStep data={listingData} onUpdate={updateListingData} />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="border-b bg-card shadow-sm">
                <div className="container max-w-5xl mx-auto px-6 py-5">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-[var(--transition-smooth)] group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                        <span className="font-medium">Back</span>
                    </button>
                </div>
            </div>

            <div className="container max-w-5xl mx-auto px-6 py-12">
                <div className="mb-12">
                    <StepIndicator steps={steps} currentStep={currentStep} />
                </div>

                <div className="bg-card rounded-xl shadow-[var(--shadow-card)] border border-border p-8 md:p-10 mb-8">
                    {renderStep()}
                </div>

                <div className="flex justify-between items-center gap-4">
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentStep === 0}
                        size="lg"
                        className="min-w-[120px]"
                    >
                        Previous
                    </Button>
                    <Button
                        onClick={handleNext}
                        size="lg"
                        className="min-w-[120px]"
                        disabled={status === "loading"}
                    >
                        {status === "loading"
                            ? "Submitting..."
                            : currentStep === steps.length - 1
                                ? "Submit Listing"
                                : "Next"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ExperienceListingForm;
