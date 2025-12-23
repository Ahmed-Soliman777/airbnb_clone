import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBookings, cancelBooking } from "@/store/Slices/bookingSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
    Calendar,
    MapPin,
    Users,
    Clock,
    XCircle,
    CalendarCheck,
    CalendarX,
} from "lucide-react";
import { format, isPast, isFuture } from "date-fns";

const ReservationsPage = () => {
    const dispatch = useDispatch();
    const { bookings, status } = useSelector((state) => state.booking);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchUserBookings());
    }, [dispatch]);

    const handleCancelBooking = async (bookingId) => {
        try {
            await dispatch(cancelBooking(bookingId)).unwrap();
            toast({
                title: "Reservation Cancelled",
                description: "Your reservation has been cancelled successfully.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error || "Failed to cancel reservation.",
                variant: "destructive",
            });
        }
    };

    const upcomingBookings = bookings.filter(
        (b) => isFuture(new Date(b.checkInDate)) && b.status !== "cancelled"
    );
    const pastBookings = bookings.filter(
        (b) => isPast(new Date(b.checkOutDate)) || b.status === "cancelled"
    );


    const getStatusBadge = (status) => {
        switch (status) {
            case "confirmed":
                return <Badge className="bg-green-600">Confirmed</Badge>;
            case "pending":
                return <Badge variant="secondary">Pending</Badge>;
            case "cancelled":
                return <Badge variant="destructive">Cancelled</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const BookingCard = ({ booking }) => {
        const { listing, service, experience, checkInDate, checkOutDate, guestsCount, totalPrice, status } = booking;

        // Determine the actual item booked
        const item = listing || service || experience;
        const itemType = listing ? 'listing' : service ? 'service' : 'experience';

        const isUpcoming = isFuture(new Date(checkInDate)) && status !== "cancelled";

        const getItemLink = () => {
            if (listing) return `/room/${listing._id}`;
            if (service) return `/services/${service._id}`;
            if (experience) return `/experiences/${experience._id}`;
            return "#";
        };

        const getItemTypeLabel = () => {
            if (listing) return "Listing";
            if (service) return "Service";
            if (experience) return "Experience";
            return "Booking";
        };

        return (
            <div className="border rounded-xl overflow-hidden bg-card hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="md:w-48 h-40 md:h-auto">
                        <img
                            src={item?.images?.[0].url || "/placeholder.svg"}
                            alt={item?.title || "Item"}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Details */}
                    <div className="flex-1 p-4 md:p-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    {getStatusBadge(status)}
                                    <Badge variant="outline">{getItemTypeLabel()}</Badge>
                                </div>

                                <h3 className="text-lg font-semibold">
                                    {item?.title || "Booking Details"}
                                </h3>

                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>
                                            {[item?.city, item?.country].filter(Boolean).join(", ") || "Location not specified"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>
                                            {format(new Date(checkInDate), "MMM d")} –{" "}
                                            {format(new Date(checkOutDate), "MMM d, yyyy")}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        <span>{guestsCount} guest{guestsCount > 1 ? "s" : ""}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-3">
                                <div className="text-right">
                                    <p className="text-lg font-semibold">${totalPrice}</p>
                                    <p className="text-sm text-muted-foreground">Total</p>
                                </div>

                                <div className="flex gap-2">
                                    {item?._id && (
                                        <Button variant="outline" size="sm" asChild>
                                            <Link to={getItemLink()}>View Details</Link>
                                        </Button>
                                    )}

                                    {isUpcoming && status === "pending" && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="sm">
                                                    <XCircle className="w-4 h-4 mr-1" />
                                                    Cancel
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Cancel Reservation</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to cancel this reservation? This
                                                        action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Keep Reservation</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleCancelBooking(booking._id)}
                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                    >
                                                        <span className="text-white">Cancel Reservation</span>
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const EmptyState = ({ type }) => (
        <div className="text-center py-16">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                {type === "upcoming" ? (
                    <CalendarCheck className="w-8 h-8 text-muted-foreground" />
                ) : (
                    <CalendarX className="w-8 h-8 text-muted-foreground" />
                )}
            </div>
            <h3 className="text-lg font-medium mb-2">
                {type === "upcoming" ? "No upcoming reservations" : "No past reservations"}
            </h3>
            <p className="text-muted-foreground mb-6">
                {type === "upcoming"
                    ? "Time to start planning your next trip!"
                    : "Your past trips will appear here"}
            </p>
            {type === "upcoming" && (
                <Button asChild>
                    <Link to="/homes">Start Exploring</Link>
                </Button>
            )}
        </div>
    );

    const LoadingSkeleton = () => (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-xl p-6">
                    <div className="flex gap-6">
                        <Skeleton className="w-48 h-32 rounded-lg" />
                        <div className="flex-1 space-y-3">
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-6 w-64" />
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">My Reservations</h1>

                <Tabs defaultValue="upcoming" className="w-full">
                    <TabsList className="w-full mb-6">
                        <TabsTrigger value="upcoming" className="flex-1">
                            Upcoming ({upcomingBookings.length})
                        </TabsTrigger>
                        <TabsTrigger value="past" className="flex-1">
                            Past ({pastBookings.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upcoming">
                        {status === "loading" ? (
                            <LoadingSkeleton />
                        ) : upcomingBookings.length > 0 ? (
                            <div className="space-y-4">
                                {upcomingBookings.map((booking) => (
                                    <BookingCard key={booking._id} booking={booking} />
                                ))}
                            </div>
                        ) : (
                            <EmptyState type="upcoming" />
                        )}
                    </TabsContent>

                    <TabsContent value="past">
                        {status === "loading" ? (
                            <LoadingSkeleton />
                        ) : pastBookings.length > 0 ? (
                            <div className="space-y-4">
                                {pastBookings.map((booking) => (
                                    <BookingCard key={booking._id} booking={booking} />
                                ))}
                            </div>
                        ) : (
                            <EmptyState type="past" />
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default ReservationsPage;
