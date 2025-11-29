import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText } from "lucide-react";

export default function ServiceDetailsStep({ data, onUpdate }) {
  const updateServiceDetails = (field, value) => {
    onUpdate({
      serviceDetails: {
        ...data.serviceDetails,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-accent-foreground" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Service policies & details
        </h2>
        <p className="text-muted-foreground">
          Help clients understand your policies
        </p>
      </div>

      <div className="space-y-6 max-w-xl mx-auto">
        <div>
          <Label htmlFor="responseTime">Average Response Time</Label>
          <Select
            value={data.serviceDetails?.responseTime || ""}
            onValueChange={(value) => updateServiceDetails("responseTime", value)}
          >
            <SelectTrigger id="responseTime" className="mt-1.5">
              <SelectValue placeholder="Select response time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="within-1-hour">Within 1 hour</SelectItem>
              <SelectItem value="within-3-hours">Within 3 hours</SelectItem>
              <SelectItem value="within-24-hours">Within 24 hours</SelectItem>
              <SelectItem value="1-2-days">1-2 business days</SelectItem>
              <SelectItem value="2-3-days">2-3 business days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
          <Select
            value={data.serviceDetails?.cancellationPolicy || ""}
            onValueChange={(value) => updateServiceDetails("cancellationPolicy", value)}
          >
            <SelectTrigger id="cancellationPolicy" className="mt-1.5">
              <SelectValue placeholder="Select cancellation policy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flexible">Flexible - Free cancellation 24 hours before</SelectItem>
              <SelectItem value="moderate">Moderate - 50% refund if cancelled 48 hours before</SelectItem>
              <SelectItem value="strict">Strict - No refund once booked</SelectItem>
              <SelectItem value="custom">Custom policy (describe below)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="additionalInfo">Additional Information</Label>
          <Textarea
            id="additionalInfo"
            placeholder="Any other important details clients should know about your service, policies, or process..."
            value={data.serviceDetails?.additionalInfo || ""}
            onChange={(e) => updateServiceDetails("additionalInfo", e.target.value)}
            className="mt-1.5 min-h-[120px]"
          />
          <p className="text-sm text-muted-foreground mt-1.5">
            {data.serviceDetails?.additionalInfo?.length || 0} characters
          </p>
        </div>

        {data.serviceDetails?.responseTime && data.serviceDetails?.cancellationPolicy && (
          <div className="p-4 bg-muted rounded-lg mt-6">
            <h3 className="font-semibold text-foreground mb-2">Service Policies</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Response time: </span>
                <span className="text-foreground capitalize">
                  {data.serviceDetails.responseTime.replace(/-/g, ' ')}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Cancellation: </span>
                <span className="text-foreground capitalize">
                  {data.serviceDetails.cancellationPolicy}
                </span>
              </div>
              {data.serviceDetails.additionalInfo && (
                <div className="pt-2 border-t border-border mt-2">
                  <p className="text-muted-foreground text-xs">Additional Info:</p>
                  <p className="text-foreground mt-1 line-clamp-3">
                    {data.serviceDetails.additionalInfo}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
