import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchHostPayments } from "@/store/Slices/paymentSlice";
import { format } from "date-fns";
import {
    ArrowLeft,
    Wallet,
    TrendingUp,
    DollarSign,
    Calendar,
    Home,
    Sparkles,
    Briefcase,
    Loader2,
    CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function HostWalletPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { hostPayments, hostPaymentsStatus } = useSelector((state) => state.payment);
    const [stats, setStats] = useState({
        totalEarnings: 0,
        confirmedEarnings: 0,
        pendingEarnings: 0,
        listingsEarnings: 0,
        experiencesEarnings: 0,
        servicesEarnings: 0,
    });

    useEffect(() => {
        dispatch(fetchHostPayments());
    }, [dispatch]);

    useEffect(() => {
        if (hostPayments && hostPayments.length > 0) {
            const confirmed = hostPayments.filter((b) => b.status === "confirmed");
            const pending = hostPayments.filter((b) => b.status === "pending");

            const confirmedEarnings = confirmed.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
            const pendingEarnings = pending.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

            const listingsEarnings = confirmed
                .filter((b) => b.listing)
                .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
            const experiencesEarnings = confirmed
                .filter((b) => b.experience)
                .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
            const servicesEarnings = confirmed
                .filter((b) => b.service)
                .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

            setStats({
                totalEarnings: confirmedEarnings + pendingEarnings,
                confirmedEarnings,
                pendingEarnings,
                listingsEarnings,
                experiencesEarnings,
                servicesEarnings,
            });
        }
    }, [hostPayments]);

    const getItemType = (booking) => {
        if (booking.listing) return { type: "Listing", icon: Home, name: booking.listing.title };
        if (booking.experience) return { type: "Experience", icon: Sparkles, name: booking.experience.title };
        if (booking.service) return { type: "Service", icon: Briefcase, name: booking.service.title };
        return { type: "Unknown", icon: Home, name: "N/A" };
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "confirmed":
                return "bg-green-100 text-green-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-muted text-muted-foreground";
        }
    };

    if (hostPaymentsStatus === "loading") {
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
                        <Wallet className="h-5 w-5" />
                        Host Wallet
                    </h1>
                    <div className="w-20" />
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Earnings</p>
                                    <p className="text-3xl font-bold">${stats.totalEarnings.toFixed(2)}</p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                                    <TrendingUp className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Confirmed</p>
                                    <p className="text-3xl font-bold text-green-600">${stats.confirmedEarnings.toFixed(2)}</p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <DollarSign className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Pending</p>
                                    <p className="text-3xl font-bold text-yellow-600">${stats.pendingEarnings.toFixed(2)}</p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                    <CreditCard className="h-6 w-6 text-yellow-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Bookings</p>
                                    <p className="text-3xl font-bold">{hostPayments?.length || 0}</p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                    <Calendar className="h-6 w-6 text-muted-foreground" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Earnings Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Earnings Breakdown
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-4 p-4 rounded-lg border border-border">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <Home className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Listings</p>
                                    <p className="text-xl font-semibold">${stats.listingsEarnings.toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-lg border border-border">
                                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                    <Sparkles className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Experiences</p>
                                    <p className="text-xl font-semibold">${stats.experiencesEarnings.toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-lg border border-border">
                                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                                    <Briefcase className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Services</p>
                                    <p className="text-xl font-semibold">${stats.servicesEarnings.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Separator />

                {/* Recent Transactions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Recent Transactions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!hostPayments || hostPayments.length === 0 ? (
                            <div className="text-center py-12">
                                <Wallet className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                                <p className="text-muted-foreground">No transactions yet</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Earnings will appear here once guests book your listings
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Item</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Guest</TableHead>
                                            <TableHead>Dates</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Amount</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {hostPayments.slice(0, 10).map((booking) => {
                                            const item = getItemType(booking);
                                            const ItemIcon = item.icon;
                                            return (
                                                <TableRow key={booking._id}>
                                                    <TableCell className="font-medium max-w-[200px] truncate">
                                                        {item.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <ItemIcon className="h-4 w-4 text-muted-foreground" />
                                                            {item.type}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {booking.user?.firstName && booking.user?.lastName
                                                            ? `${booking.user.firstName} ${booking.user.lastName}`
                                                            : booking.user?.firstName || booking.user?.lastName || booking.user?.email || "Guest"}
                                                    </TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">
                                                        {format(new Date(booking.checkInDate), "MMM d")} -{" "}
                                                        {format(new Date(booking.checkOutDate), "MMM d, yyyy")}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className={getStatusColor(booking.status)}>
                                                            {booking.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right font-semibold">
                                                        ${booking.totalPrice?.toFixed(2) || "0.00"}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}