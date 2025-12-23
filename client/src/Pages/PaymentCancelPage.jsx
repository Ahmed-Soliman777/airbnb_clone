import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, RotateCcw } from "lucide-react";

const PaymentCancelPage = () => {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                    <XCircle className="w-12 h-12 text-destructive" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-foreground">
                        Payment Cancelled
                    </h1>
                    <p className="text-muted-foreground">
                        Your payment was not completed. Don't worry, you haven't been
                        charged. You can try again or explore other options.
                    </p>
                </div>

                <div className="bg-card border rounded-xl p-6 text-left">
                    <h3 className="font-medium mb-2">What happened?</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• The payment was cancelled before completion</li>
                        <li>• Your card was not charged</li>
                        <li>• The reservation was not confirmed</li>
                    </ul>
                </div>

                <div className="flex flex-col gap-3">
                    <Button
                        size="lg"
                        className="w-full"
                        onClick={() => window.history.back()}
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Try Again
                    </Button>

                    <Button variant="outline" size="lg" className="w-full" asChild>
                        <Link to="/homes">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Home
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PaymentCancelPage;
