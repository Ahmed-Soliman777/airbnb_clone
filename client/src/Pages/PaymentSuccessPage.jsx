import { useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyPayment, setPaymentStatus } from "@/store/Slices/paymentSlice";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, ArrowRight } from "lucide-react";

const PaymentSuccessPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.payment);

    const sessionId = searchParams.get("session_id");

    useEffect(() => {
        if (sessionId) {
            dispatch(verifyPayment(sessionId));
        } else {
            dispatch(setPaymentStatus("success"));
        }
    }, [sessionId, dispatch]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center space-y-6">
                {loading ? (
                    <div className="space-y-4">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-muted-foreground">Verifying payment...</p>
                    </div>
                ) : (
                    <>
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold text-foreground">
                                Payment Successful!
                            </h1>
                            <p className="text-muted-foreground">
                                Your reservation has been confirmed. We've sent a confirmation
                                email with all the details.
                            </p>
                        </div>

                        <div className="bg-card border rounded-xl p-6 text-left space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">Booking Confirmed</p>
                                    <p className="text-sm text-muted-foreground">
                                        Check your email for confirmation details
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button
                                size="lg"
                                className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700"
                                onClick={() => navigate("/reservations")}
                            >
                                View My Reservations
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>

                            <Button variant="outline" size="lg" className="w-full" asChild>
                                <Link to="/homes">Continue Exploring</Link>
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
