import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generatePricePerNight } from "@/utils/ai";
import { DollarSign } from "lucide-react";
import { useState } from "react";

const PricingStep = ({ data, onUpdate }) => {

  const [loading, setLoading] = useState(false);

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
          You can always change this later
        </p>
      </div>

      <div className="space-y-4 max-w-xl mx-auto">
        <div>
          <Label htmlFor="pricePerNight">Price per night ($)</Label>
          <Input
            id="pricePerNight"
            type="number"
            min="0"
            placeholder="100"
            value={data.pricePerNight || ""}
            onChange={(e) =>
              onUpdate({ pricePerNight: parseFloat(e.target.value) || 0 })
            }
            className="mt-1.5"
          />
          <button
            type="button"
            disabled={
              loading ||
              data.coordinates?.lat == null ||
              data.coordinates?.lng == null
            }
            onClick={async () => {
              try {
                setLoading(true);
                const { lat, lng } = data.coordinates;
                const text = await generatePricePerNight(lat, lng);
                onUpdate({ pricePerNight: parseFloat(text) || 0 });
              } catch (err) {
                console.error("Price generation failed:", err);
              } finally {
                setLoading(false);
              }
            }}
            className="bg-[#ff385c] text-white px-4 py-2 rounded-md mt-2 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate with AI"}
          </button>
          <p className="text-sm text-muted-foreground mt-1.5">
            Base price for one night's stay
          </p>
        </div>

        <div>
          <Label htmlFor="cleaningFee">Cleaning fee ($)</Label>
          <Input
            id="cleaningFee"
            type="number"
            min="0"
            placeholder="50"
            value={data.cleaningFee || ""}
            onChange={(e) =>
              onUpdate({ cleaningFee: parseFloat(e.target.value) || 0 })
            }
            className="mt-1.5"
          />
          <p className="text-sm text-muted-foreground mt-1.5">
            One-time fee charged per reservation
          </p>
        </div>

        {data.pricePerNight && (
          <div className="mt-6 p-4 bg-accent rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Example (3 nights)</span>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  ${data.pricePerNight} × 3 nights
                </div>
                {data.cleaningFee && (
                  <div className="text-sm text-muted-foreground">
                    + ${data.cleaningFee} cleaning fee
                  </div>
                )}
                <div className="text-xl font-semibold text-foreground mt-1">
                  $
                  {(data.pricePerNight * 3 + (data.cleaningFee || 0)).toFixed(
                    2
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingStep;
