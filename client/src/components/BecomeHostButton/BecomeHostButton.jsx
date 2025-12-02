import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Home, Loader2 } from "lucide-react";
import { becomeHost, getUserProfile } from "@/utils/userApi";
import { toast } from "sonner";

const BecomeHostButton = ({ className }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleBecomeHost = async () => {
    setIsLoading(true);
    try {
      // First check if user is already a host
      const profileData = await getUserProfile();
      
      if (profileData.data.role === 'host' || profileData.data.role === 'main-host') {
        toast.info("You're already a host!");
        navigate("/host/dashboard");
        return;
      }

      // Update user role to host
      await becomeHost();
      
      // First time becoming a host - show welcome page
      toast.success("Congratulations! You're now a host!");
      navigate("/host/welcome");
    } catch (error) {
      toast.error(error || "Failed to become a host");
    } finally {
      setIsLoading(false);
      setShowDialog(false);
    }
  };

  return (
    <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
      <AlertDialogTrigger asChild>
        <Button className={className} size="lg">
          <Home className="w-5 h-5 mr-2" />
          Become a Host
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Home className="w-6 h-6 text-primary" />
            Become a Host
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3 pt-2">
            <p>
              Ready to start earning by sharing your spaces, experiences, or services?
            </p>
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="font-semibold text-foreground">As a host, you can:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>List properties, experiences, and services</li>
                <li>Set your own prices and availability</li>
                <li>Connect with guests worldwide</li>
                <li>Manage bookings from your dashboard</li>
              </ul>
            </div>
            <p className="text-sm">
              Click confirm to upgrade your account to a host account.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleBecomeHost} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm & Continue"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BecomeHostButton;
