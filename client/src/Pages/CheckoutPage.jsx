import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handlePayment, clearPaymentState } from "@/store/Slices/paymentSlice";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
    ArrowLeft,
    MapPin,
    Calendar,
    Users,
    Clock,
    CreditCard,
    Shield,
    Star,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { format } from "date-fns";

const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const { toast } = useToast();

    const { loading, error } = useSelector((state) => state.payment);
    const [showPriceDetails, setShowPriceDetails] = useState(false);

    // Get booking data from navigation state
    const bookingData = location.state;

    useEffect(() => {
        // If no booking data, redirect back
        if (!bookingData) {
            navigate("/");
            return;
        }

        return () => {
            dispatch(clearPaymentState());
        };
    }, [bookingData, navigate, dispatch]);

    if (!bookingData) {
        return null;
    }

    const {
        type, // 'listing', 'experience', 'service'
        item, // the listing/experience/service object
        checkInDate,
        checkOutDate,
        guests,
        totalPrice,
        pricePerNight,
        pricePerPerson,
        hourlyRate,
        nights,
        serviceFee,
        cleaningFee,
    } = bookingData;

    const handleProceedToPayment = async () => {
        const paymentData = {
            listing: type === 'listing' ? item._id : undefined,
            service: type === 'service' ? item._id : undefined,
            experience: type === 'experience' ? item._id : undefined,
            bookingType: type, // Helpful for backend
            checkInDate,
            checkOutDate,
            guestsCount: guests?.adults + (guests?.children || 0) || guests || 1,
            totalPrice,
        };

        try {
            const result = await dispatch(handlePayment(paymentData)).unwrap();

            if (result.checkoutUrl) {
                // Redirect to Stripe checkout
                window.location.href = result.checkoutUrl;
            }
        } catch (err) {
            toast({
                title: "Payment Error",
                description: err || "Failed to process payment. Please try again.",
                variant: "destructive",
            });
        }
    };

    const getItemImage = () => {
        if (item.images && item.images.length > 0) {
            return item.images[0];
        }
        return "/placeholder.svg";
    };

    const getItemLocation = () => {
        const parts = [item.street, item.city, item.country, item.serviceArea].filter(Boolean);
        return parts.join(", ") || "Location not specified";
    };

    const getTypeLabel = () => {
        switch (type) {
            case "experience":
                return item.experienceType || "Experience";
            case "service":
                return item.serviceCategory || "Service";
            default:
                return item.propertyType || "Home";
        }
    };

    const renderPriceBreakdown = () => {
        if (type === "listing") {
            return (
                <>
                    <div className="flex justify-between text-muted-foreground">
                        <span>
                            ${pricePerNight} x {nights} night{nights > 1 ? "s" : ""}
                        </span>
                        <span>${pricePerNight * nights}</span>
                    </div>
                    {cleaningFee > 0 && (
                        <div className="flex justify-between text-muted-foreground">
                            <span>Cleaning fee</span>
                            <span>${cleaningFee}</span>
                        </div>
                    )}
                    {serviceFee > 0 && (
                        <div className="flex justify-between text-muted-foreground">
                            <span>Service fee</span>
                            <span>${serviceFee}</span>
                        </div>
                    )}
                </>
            );
        } else if (type === "experience") {
            const guestCount = guests?.adults + (guests?.children || 0) || guests || 1;
            return (
                <div className="flex justify-between text-muted-foreground">
                    <span>
                        ${pricePerPerson} x {guestCount} guest{guestCount > 1 ? "s" : ""}
                    </span>
                    <span>${pricePerPerson * guestCount}</span>
                </div>
            );
        } else {
            return (
                <div className="flex justify-between text-muted-foreground">
                    <span>${hourlyRate} per hour</span>
                    <span>${totalPrice}</span>
                </div>
            );
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background border-b">
                <div className="container max-w-5xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-accent rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-xl font-semibold">Confirm and pay</h1>
                    </div>
                </div>
            </header>

            <main className="container max-w-5xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column - Trip Details */}
                    <div className="space-y-8">
                        {/* Your Trip Section */}
                        <div>
                            <h2 className="text-2xl font-semibold mb-6">Your trip</h2>

                            <div className="space-y-6">
                                {/* Dates */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium">Dates</h3>
                                        <p className="text-muted-foreground">
                                            {checkInDate && checkOutDate
                                                ? `${format(new Date(checkInDate), "MMM d")} – ${format(new Date(checkOutDate), "MMM d, yyyy")}`
                                                : format(new Date(checkInDate), "MMM d, yyyy")}
                                        </p>
                                    </div>
                                    <Button variant="link" className="p-0 h-auto" onClick={() => navigate(-1)}>
                                        Edit
                                    </Button>
                                </div>

                                {/* Guests */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium">Guests</h3>
                                        <p className="text-muted-foreground">
                                            {typeof guests === "object"
                                                ? `${guests.adults} adult${guests.adults > 1 ? "s" : ""}${guests.children > 0 ? `, ${guests.children} child${guests.children > 1 ? "ren" : ""}` : ""}`
                                                : `${guests || 1} guest${guests > 1 ? "s" : ""}`}
                                        </p>
                                    </div>
                                    <Button variant="link" className="p-0 h-auto" onClick={() => navigate(-1)}>
                                        Edit
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Payment Section */}
                        <div>
                            <h2 className="text-2xl font-semibold mb-6">Pay with</h2>

                            <div className="border rounded-xl p-4 flex items-center justify-between bg-card">
                                <div className="flex items-center gap-3">
                                    <CreditCard className="w-8 h-8 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">Credit or debit card</p>
                                        <p className="text-sm text-muted-foreground">
                                            Secure payment via Stripe
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <img src="https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg" alt="Visa" className="h-6" />
                                    <img src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg" alt="Mastercard" className="h-6" />
                                    <img src="https://js.stripe.com/v3/fingerprinted/img/amex-a49b82f46c5cd6a96a6e418a6ca1717c.svg" alt="Amex" className="h-6" />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Cancellation Policy */}
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Cancellation policy</h2>
                            <p className="text-muted-foreground">
                                Free cancellation before{" "}
                                <span className="font-medium text-foreground">
                                    {format(new Date(checkInDate), "MMM d, yyyy")}
                                </span>
                                . Cancel before check-in for a full refund.
                            </p>
                        </div>

                        <Separator />

                        {/* Ground Rules */}
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Ground rules</h2>
                            <p className="text-muted-foreground mb-4">
                                We ask every guest to remember a few simple things about what makes a great guest.
                            </p>
                            <ul className="space-y-2 text-muted-foreground">
                                <li className="flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    Follow the house rules
                                </li>
                                <li className="flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    Treat your Host's home like your own
                                </li>
                            </ul>
                        </div>

                        <Separator />

                        {/* Terms Agreement */}
                        <p className="text-sm text-muted-foreground">
                            By selecting the button below, I agree to the{" "}
                            <Link to="/terms" className="text-primary underline">
                                Host's House Rules
                            </Link>
                            ,{" "}
                            <Link to="/terms" className="text-primary underline">
                                Ground rules for guests
                            </Link>
                            , and the{" "}
                            <Link to="/terms" className="text-primary underline">
                                Rebooking and Refund Policy
                            </Link>
                            .
                        </p>

                        {/* Error Display */}
                        {error && (
                            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                                <p className="text-destructive text-sm">{error}</p>
                            </div>
                        )}

                        {/* Proceed Button */}
                        <Button
                            size="lg"
                            className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white"
                            onClick={handleProceedToPayment}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Processing...
                                </span>
                            ) : (
                                `Confirm and pay • $${totalPrice}`
                            )}
                        </Button>
                    </div>

                    {/* Right Column - Booking Summary */}
                    <div className="lg:pl-8">
                        <div className="sticky top-24 border rounded-xl p-6 bg-card shadow-sm">
                            {/* Item Preview */}
                            <div className="flex gap-4 pb-6 border-b">
                                <img
                                    src={getItemImage()}
                                    alt={item.title}
                                    className="w-32 h-24 object-cover rounded-lg"
                                />
                                <div className="flex-1 min-w-0">
                                    <Badge variant="secondary" className="mb-1 text-xs">
                                        {getTypeLabel()}
                                    </Badge>
                                    <h3 className="font-medium truncate">{item.title}</h3>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                        <Star className="w-3 h-3 fill-foreground text-foreground" />
                                        <span>{item.rating || 4.9}</span>
                                        {item.reviewCount > 0 && (
                                            <span>({item.reviewCount} reviews)</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                        <MapPin className="w-3 h-3" />
                                        <span className="truncate">{getItemLocation()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Price Details */}
                            <div className="py-6 border-b">
                                <button
                                    className="flex items-center justify-between w-full text-left"
                                    onClick={() => setShowPriceDetails(!showPriceDetails)}
                                >
                                    <h3 className="font-semibold">Price details</h3>
                                    {showPriceDetails ? (
                                        <ChevronUp className="w-5 h-5" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5" />
                                    )}
                                </button>

                                {showPriceDetails && (
                                    <div className="mt-4 space-y-3">
                                        {renderPriceBreakdown()}
                                    </div>
                                )}
                            </div>

                            {/* Total */}
                            <div className="pt-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold">Total (USD)</span>
                                    <span className="text-lg font-semibold">${totalPrice}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CheckoutPage;
