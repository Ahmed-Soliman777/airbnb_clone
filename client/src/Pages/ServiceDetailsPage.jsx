import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getServiceById, clearCurrentService } from "@/store/Slices/serviceSlice";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    Star,
    Clock,
    MapPin,
    Share,
    Heart,
    Check,
    MessageCircle,
    Calendar,
    Shield,
} from "lucide-react";

const ServiceDetailsPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { service, status } = useSelector((state) => state.service);

    useEffect(() => {
        dispatch(getServiceById(id));
        return () => {
            dispatch(clearCurrentService());
        };
    }, [dispatch, id]);

    if (status === "loading" || !service) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container max-w-6xl mx-auto px-4 py-8">
                    <Skeleton className="h-8 w-32 mb-6" />
                    <Skeleton className="aspect-[16/9] rounded-xl mb-8" />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <Skeleton className="h-10 w-3/4" />
                            <Skeleton className="h-24 w-full" />
                        </div>
                        <Skeleton className="h-96 rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    const {
        title,
        description,
        images,
        city,
        country,
        serviceArea,
        hourlyRate,
        serviceCategory,
        packages,
        availability,
        requirements,
        skills,
        serviceDetails,
        rating = 4.8,
        reviewCount = 0,
    } = service;

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className=" border-b">
                <div className="container max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link
                            to="/services"
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-medium">Back</span>
                        </Link>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                                <Share className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <Heart className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Image Gallery */}
            <section className="container max-w-6xl mx-auto px-4 py-6">
                <div className="grid grid-cols-4 gap-2 rounded-xl overflow-hidden">
                    {images && images.length > 0 ? (
                        <>
                            <div className="col-span-4 md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto">
                                <img
                                    src={images[0].url}
                                    alt={title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {images.slice(1, 5).map((img, index) => (
                                <div key={index} className="hidden md:block aspect-[4/3]">
                                    <img
                                        src={img.url}
                                        alt={`${title} ${index + 2}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="col-span-4 aspect-[16/9] bg-muted rounded-xl flex items-center justify-center">
                            <p className="text-muted-foreground">No images available</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Content */}
            <main className="container max-w-6xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Title Section */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary">{serviceCategory || "Service"}</Badge>
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-foreground text-foreground" />
                                    <span className="font-medium">{rating}</span>
                                    {reviewCount > 0 && (
                                        <span className="text-muted-foreground">
                                            ({reviewCount} reviews)
                                        </span>
                                    )}
                                </div>
                            </div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
                            <div className="flex items-center gap-4 text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>{[serviceArea, city, country].filter(Boolean).join(", ")}</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Info */}
                        <div className="flex flex-wrap gap-6 py-6 border-y">
                            {serviceDetails?.responseTime && (
                                <div className="flex items-center gap-2">
                                    <MessageCircle className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">{serviceDetails.responseTime}</p>
                                        <p className="text-sm text-muted-foreground">Response time</p>
                                    </div>
                                </div>
                            )}
                            {serviceDetails?.cancellationPolicy && (
                                <div className="flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">{serviceDetails.cancellationPolicy}</p>
                                        <p className="text-sm text-muted-foreground">Cancellation</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <h2 className="text-xl font-semibold text-foreground mb-4">
                                About this service
                            </h2>
                            <p className="text-muted-foreground whitespace-pre-line">
                                {description || "No description provided."}
                            </p>
                        </div>

                        {/* Skills */}
                        {skills && skills.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold text-foreground mb-4">
                                    Skills & expertise
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill, index) => (
                                        <Badge key={index} variant="outline" className="py-1.5 px-3">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Packages */}
                        {packages && packages.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold text-foreground mb-4">
                                    Service packages
                                </h2>
                                <div className="grid gap-4">
                                    {packages.map((pkg, index) => (
                                        <div
                                            key={index}
                                            className="border rounded-lg p-4 hover:border-primary transition-colors"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-semibold">{pkg.name || `Package ${index + 1}`}</h3>
                                                <span className="font-bold">${pkg.price}</span>
                                            </div>
                                            {pkg.description && (
                                                <p className="text-sm text-muted-foreground">{pkg.description}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Requirements */}
                        {requirements && requirements.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold text-foreground mb-4">
                                    Requirements
                                </h2>
                                <ul className="space-y-2">
                                    {requirements.map((req, index) => (
                                        <li key={index} className="flex items-center gap-2">
                                            <Check className="w-5 h-5 text-primary" />
                                            <span>{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Availability */}
                        {availability && availability.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold text-foreground mb-4">
                                    Availability
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {availability.map((slot, index) => (
                                        <Badge key={index} variant="outline" className="py-2 px-3">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            {slot.day || slot} {slot.time && `at ${slot.time}`}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Additional Info */}
                        {serviceDetails?.additionalInfo && (
                            <div>
                                <h2 className="text-xl font-semibold text-foreground mb-4">
                                    Additional information
                                </h2>
                                <p className="text-muted-foreground whitespace-pre-line">
                                    {serviceDetails.additionalInfo}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-card border rounded-xl p-6 shadow-lg">
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-2xl font-bold">${hourlyRate}</span>
                                <span className="text-muted-foreground">/ hour</span>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="border rounded-lg p-3">
                                    <label className="text-xs font-medium text-muted-foreground">
                                        DATE
                                    </label>
                                    <p className="font-medium">Select a date</p>
                                </div>
                                <div className="border rounded-lg p-3">
                                    <label className="text-xs font-medium text-muted-foreground">
                                        TIME
                                    </label>
                                    <p className="font-medium">Select time</p>
                                </div>
                            </div>

                            <Button className="w-full mb-4" size="lg">
                                Request Booking
                            </Button>

                            <Button variant="outline" className="w-full" size="lg">
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Contact Provider
                            </Button>

                            <p className="text-center text-sm text-muted-foreground mt-4">
                                Free cancellation available
                            </p>

                            <div className="border-t mt-6 pt-6">
                                <div className="flex justify-between mb-2">
                                    <span className="text-muted-foreground">
                                        ${hourlyRate} x 1 hour
                                    </span>
                                    <span>${hourlyRate}</span>
                                </div>
                                <div className="flex justify-between font-semibold pt-4 border-t">
                                    <span>Estimated total</span>
                                    <span>${hourlyRate}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ServiceDetailsPage;
