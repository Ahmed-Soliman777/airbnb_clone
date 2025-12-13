import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, Flag, ChevronRight, X } from "lucide-react";
import { reportListing } from "@/store/Slices/reportSlice";

const REPORT_REASONS = [
  {
    id: "inaccurate",
    label: "It's inaccurate or incorrect",
    description: "The listing contains misleading information",
  },
  {
    id: "safety",
    label: "It's a safety issue",
    description: "There are safety or health concerns",
  },
  {
    id: "scam",
    label: "It's a scam",
    description: "This listing appears to be fraudulent",
  },
  {
    id: "offensive",
    label: "It's offensive",
    description: "Contains inappropriate or offensive content",
  },
  {
    id: "not_real",
    label: "It's not a real place to stay",
    description: "The property doesn't exist or isn't available",
  },
  {
    id: "discrimination",
    label: "It's discriminatory",
    description: "Contains discriminatory language or practices",
  },
  {
    id: "other",
    label: "Something else",
    description: "A different issue not listed above",
  },
];

const ReportListingDialog = ({
  open,
  onOpenChange,
  listingId,
  listingTitle,
}) => {
  const dispatch = useDispatch();
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleReasonSelect = (reasonId) => {
    setSelectedReason(reasonId);
    setError("");
  };

  const handleSubmit = async () => {
    if (!selectedReason) {
      setError("Please select a reason");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const resultAction = await dispatch(
        reportListing({
          listingId,
          reason: selectedReason,
          details: additionalDetails,
        })
      );

      if (reportListing.fulfilled.match(resultAction)) {
        setIsSuccess(true);
        // Reset and close after showing success
        setTimeout(() => {
          handleClose();
        }, 3000);
      } else {
        setError(resultAction.payload?.message || "Failed to submit report. Please try again.");
      }
    } catch (err) {
      console.error("Report submission error:", err);
      setError("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setIsSuccess(false);
      setSelectedReason("");
      setAdditionalDetails("");
      setError("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[568px] p-0 gap-0">
        {!isSuccess ? (
          <>
            <DialogHeader className="p-6 pb-4 border-b">
              <button
                onClick={handleClose}
                className="absolute left-6 top-6 rounded-full p-1 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <DialogTitle className="text-center text-base font-semibold">
                Report this listing
              </DialogTitle>
            </DialogHeader>

            <div className="px-6 py-6 max-h-[60vh] overflow-y-auto space-y-6">
              {/* Listing Info */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Listing
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {listingTitle || "Untitled Listing"}
                </p>
              </div>

              {/* Report Reasons */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">
                  Why are you reporting this listing?
                </Label>
                <div className="space-y-0 divide-y border rounded-lg">
                  {REPORT_REASONS.map((reason) => (
                    <button
                      key={reason.id}
                      onClick={() => handleReasonSelect(reason.id)}
                      className={`w-full text-left py-3 px-4 flex items-center justify-between hover:bg-gray-50 transition-colors group first:rounded-t-lg last:rounded-b-lg ${
                        selectedReason === reason.id ? "bg-gray-50" : ""
                      }`}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">
                          {reason.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {reason.description}
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 ml-3 flex items-center justify-center shrink-0 ${
                          selectedReason === reason.id
                            ? "border-gray-900 bg-gray-900"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedReason === reason.id && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-2">
                <Label
                  htmlFor="details"
                  className="text-sm font-medium text-gray-900"
                >
                  Can you provide more details? (Optional)
                </Label>
                <Textarea
                  id="details"
                  placeholder="Help us understand the issue better..."
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  rows={4}
                  className="resize-none border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                  maxLength={1000}
                />
                <p className="text-xs text-gray-500 text-right">
                  {additionalDetails.length}/1000
                </p>
              </div>

              {/* Notice */}
              <div className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-gray-700 shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700 space-y-2">
                  <p className="font-medium">Before you submit</p>
                  <p>
                    Please note that submitting false reports may result in
                    action being taken against your account. We take all reports
                    seriously and will review this listing carefully.
                  </p>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
            </div>

            <div className="p-6 pt-4 border-t bg-white">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !selectedReason}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white disabled:bg-gray-300"
              >
                {isSubmitting ? "Submitting..." : "Submit report"}
              </Button>
            </div>
          </>
        ) : (
          <div className="p-12 text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Thanks for letting us know
              </h3>
              <p className="text-gray-600">
                We'll review this listing and take appropriate action if needed.
                Your feedback helps keep our community safe.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReportListingDialog;
