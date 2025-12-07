import { useState } from "react";
import { FlagOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/";

const ReportListing = ({ listingId }) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportReasons = [
    { value: "inaccurate", label: "Inaccurate information" },
    { value: "safety", label: "Safety concerns" },
    { value: "scam", label: "Potential scam or fraud" },
    { value: "inappropriate", label: "Inappropriate content" },
    { value: "unavailable", label: "Property unavailable" },
    { value: "other", label: "Other" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) return;

    setIsSubmitting(true);
    try {
      // TODO: Implement API call to submit report
      // await submitReport({ listingId, reason, details });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Report submitted:", { listingId, reason, details });

      // Reset form and close modal
      setReason("");
      setDetails("");
      setOpen(false);

      // Show success message (you can use toast or notification system)
      alert("Thank you for your report. We'll review it shortly.");
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="text-gray-500 flex items-center gap-2 sm:gap-3 mt-4 cursor-pointer justify-center hover:text-gray-700 transition-colors">
          <FlagOff size={16} className="sm:w-[18px] sm:h-[18px]" />
          <p className="underline underline-offset-1 font-semibold text-xs sm:text-[0.9rem]">
            Report this listing
          </p>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Report this listing</DialogTitle>
          <DialogDescription>
            Help us understand what's wrong with this listing. Your report is
            anonymous.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-4">
            <Label className="text-base font-semibold">
              Why are you reporting this listing?
            </Label>
            <RadioGroup value={reason} onValueChange={setReason}>
              {reportReasons.map((item) => (
                <div key={item.value} className="flex items-center space-x-3">
                  <RadioGroupItem value={item.value} id={item.value} />
                  <Label
                    htmlFor={item.value}
                    className="font-normal cursor-pointer"
                  >
                    {item.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Additional details (optional)</Label>
            <Textarea
              id="details"
              placeholder="Please provide any additional information that might help us..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!reason || isSubmitting}
              className="bg-[#FF385C] hover:bg-[#E31C5F]"
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportListing;
