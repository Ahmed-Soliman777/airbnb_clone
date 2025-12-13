import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchHostBookings, updateBookingStatus } from "@/store/Slices/bookingSlice";
import { format } from "date-fns";
import { toast } from "sonner";
import {
    ArrowLeft,
    Users,
    Home,
    Sparkles,
    Briefcase,
    Loader2,
    Calendar,
    Mail,
    Phone,
    UserCircle,
    CheckCircle,
    XCircle,
    Clock,
    Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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

export default function HostGuestsPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { hostBookings, status } = useSelector((state) => state.booking);
    const [filter, setFilter] = useState("all");
    const [updating, setUpdating] = useState(null);

    useEffect(() => {
        dispatch(fetchHostBookings());
    }, [dispatch]);

    const handleStatusChange = async (bookingId, newStatus) => {
        setUpdating(bookingId);
        try {
            await dispatch(updateBookingStatus({ bookingId, status: newStatus })).unwrap();
            toast.success(`Booking ${newStatus} successfully!`);
        } catch (error) {
            toast.error(error || "Failed to update booking status");
        } finally {
            setUpdating(null);
        }
    };

    const getItemType = (booking) => {
        if (booking.listing) return { type: "Listing", icon: Home, name: booking.listing.title, id: booking.listing._id };
        if (booking.experience) return { type: "Experience", icon: Sparkles, name: booking.experience.title, id: booking.experience._id };
        if (booking.service) return { type: "Service", icon: Briefcase, name: booking.service.title, id: booking.service._id };
        return { type: "Unknown", icon: Home, name: "N/A", id: null };
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "confirmed":
                return (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Confirmed
                    </Badge>
                );
            case "pending":
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                    </Badge>
                );
            case "cancelled":
                return (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                        <XCircle className="h-3 w-3 mr-1" />
                        Cancelled
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const filteredBookings = hostBookings?.filter((booking) => {
        if (filter === "all") return true;
        if (filter === "listings") return booking.listing;
        if (filter === "experiences") return booking.experience;
        if (filter === "services") return booking.service;
        if (filter === "confirmed") return booking.status === "confirmed";
        if (filter === "pending") return booking.status === "pending";
        return true;
    });

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background border-b border-border">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                    <h1 className="text-lg font-semibold flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Guest Bookings
                    </h1>
                    <div className="w-20" />
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <p className="text-2xl font-bold">{hostBookings?.length || 0}</p>
                                <p className="text-sm text-muted-foreground">Total Bookings</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-600">
                                    {hostBookings?.filter((b) => b.status === "confirmed").length || 0}
                                </p>
                                <p className="text-sm text-muted-foreground">Confirmed</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-yellow-600">
                                    {hostBookings?.filter((b) => b.status === "pending").length || 0}
                                </p>
                                <p className="text-sm text-muted-foreground">Pending</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-muted-foreground">
                                    {hostBookings?.filter((b) => b.status === "cancelled").length || 0}
                                </p>
                                <p className="text-sm text-muted-foreground">Cancelled</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-4">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Filter bookings" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Bookings</SelectItem>
                            <SelectItem value="listings">Listings Only</SelectItem>
                            <SelectItem value="experiences">Experiences Only</SelectItem>
                            <SelectItem value="services">Services Only</SelectItem>
                            <SelectItem value="confirmed">Confirmed Only</SelectItem>
                            <SelectItem value="pending">Pending Only</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Bookings List */}
                {!filteredBookings || filteredBookings.length === 0 ? (
                    <Card>
                        <CardContent className="py-12">
                            <div className="text-center">
                                <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                                <p className="text-lg font-medium text-muted-foreground">No bookings found</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Guest bookings will appear here once someone books your listings
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {filteredBookings.map((booking) => {
                            const item = getItemType(booking);
                            const ItemIcon = item.icon;
                            const guest = booking.user;

                            return (
                                <Card key={booking._id} className="overflow-hidden">
                                    <CardContent className="p-0">
                                        <div className="flex flex-col md:flex-row">
                                            {/* Guest Info */}
                                            <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-border">
                                                <div className="flex items-start gap-4">
                                                    <Avatar className="h-14 w-14">
                                                        <AvatarImage src={guest?.profilePhoto} />
                                                        <AvatarFallback className="bg-primary/10">
                                                            <UserCircle className="h-8 w-8 text-primary" />
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-lg truncate">
                                                            {guest?.firstName && guest?.lastName 
                                                                ? `${guest.firstName} ${guest.lastName}` 
                                                                : guest?.firstName || guest?.lastName || "Guest"}
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                            <Mail className="h-3 w-3" />
                                                            <span className="truncate">{guest?.email || "No email"}</span>
                                                        </div>
                                                        {guest?.phone && (
                                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                                <Phone className="h-3 w-3" />
                                                                <span>{guest.phone}</span>
                                                            </div>
                                                        )}
                                                        <div className="mt-3">{getStatusBadge(booking.status)}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Booking Details */}
                                            <div className="flex-1 p-6 bg-muted/30">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <ItemIcon className="h-4 w-4 text-primary" />
                                                    <span className="text-xs font-medium text-muted-foreground uppercase">
                                                        {item.type}
                                                    </span>
                                                </div>
                                                <h4 className="font-medium mb-3 truncate">{item.name}</h4>

                                                <div className="space-y-2 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <span>
                                                            {format(new Date(booking.checkInDate), "MMM d, yyyy")} -{" "}
                                                            {format(new Date(booking.checkOutDate), "MMM d, yyyy")}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-4 w-4 text-muted-foreground" />
                                                        <span>{booking.guestsCount} guest{booking.guestsCount > 1 ? "s" : ""}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 font-semibold text-lg mt-3">
                                                        <span>${booking.totalPrice?.toFixed(2)}</span>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                {booking.status === "pending" && (
                                                    <div className="flex gap-2 mt-4">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleStatusChange(booking._id, "confirmed")}
                                                            disabled={updating === booking._id}
                                                            className="flex-1"
                                                        >
                                                            {updating === booking._id ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <>
                                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                                    Confirm
                                                                </>
                                                            )}
                                                        </Button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    disabled={updating === booking._id}
                                                                    className="flex-1"
                                                                >
                                                                    <XCircle className="h-4 w-4 mr-1" />
                                                                    Cancel
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Are you sure you want to cancel this booking? This action cannot be undone.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>No, keep it</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => handleStatusChange(booking._id, "cancelled")}
                                                                    >
                                                                        Yes, cancel booking
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}