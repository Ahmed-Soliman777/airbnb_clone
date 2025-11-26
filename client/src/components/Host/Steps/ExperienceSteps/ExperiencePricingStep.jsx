import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign } from "lucide-react";

export default function ExperiencePricingStep({ data, onUpdate }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
          <DollarSign className="w-8 h-8 text-accent-foreground" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Set your pricing
        </h2>
        <p className="text-muted-foreground">
          How much will guests pay per person?
        </p>
      </div>

      <div className="space-y-6 max-w-xl mx-auto">
        <div>
          <Label htmlFor="pricePerPerson">Price per Person ($)</Label>
          <Input
            id="pricePerPerson"
            type="number"
            min="0"
            placeholder="50"
            value={data.pricePerPerson || ""}
            onChange={(e) => onUpdate({ pricePerPerson: parseFloat(e.target.value) || 0 })}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="duration">Duration</Label>
          <Select
            value={data.duration || ""}
            onValueChange={(value) => onUpdate({ duration: value })}
          >
            <SelectTrigger id="duration" className="mt-1.5">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-hour">1 hour</SelectItem>
              <SelectItem value="2-hours">2 hours</SelectItem>
              <SelectItem value="3-hours">3 hours</SelectItem>
              <SelectItem value="4-hours">4 hours</SelectItem>
              <SelectItem value="half-day">Half day (4-6 hours)</SelectItem>
              <SelectItem value="full-day">Full day (7+ hours)</SelectItem>
              <SelectItem value="multi-day">Multi-day</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-3 block">Group Size</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minGroup" className="text-sm text-muted-foreground">
                Minimum
              </Label>
              <Input
                id="minGroup"
                type="number"
                min="1"
                placeholder="1"
                value={data.groupSize?.min || ""}
                onChange={(e) =>
                  onUpdate({
                    groupSize: {
                      ...data.groupSize,
                      min: parseInt(e.target.value) || 1,
                    },
                  })
                }
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="maxGroup" className="text-sm text-muted-foreground">
                Maximum
              </Label>
              <Input
                id="maxGroup"
                type="number"
                min="1"
                placeholder="10"
                value={data.groupSize?.max || ""}
                onChange={(e) =>
                  onUpdate({
                    groupSize: {
                      ...data.groupSize,
                      max: parseInt(e.target.value) || 10,
                    },
                  })
                }
                className="mt-1.5"
              />
            </div>
          </div>
        </div>

        {data.pricePerPerson > 0 && data.duration && (
          <div className="p-4 bg-muted rounded-lg mt-6">
            <h3 className="font-semibold text-foreground mb-2">Pricing Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price per person:</span>
                <span className="text-foreground font-medium">${data.pricePerPerson}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span className="text-foreground capitalize">{data.duration?.replace('-', ' ')}</span>
              </div>
              {data.groupSize?.min && data.groupSize?.max && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Group size:</span>
                  <span className="text-foreground">
                    {data.groupSize.min} - {data.groupSize.max} people
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
