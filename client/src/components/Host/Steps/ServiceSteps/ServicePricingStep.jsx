import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DollarSign, Plus, X } from "lucide-react";

export default function ServicePricingStep({ data, onUpdate }) {
  const [newPackage, setNewPackage] = useState({ name: "", price: "", description: "" });

  const addPackage = () => {
    if (newPackage.name && newPackage.price) {
      onUpdate({
        packages: [...(data.packages || []), newPackage],
      });
      setNewPackage({ name: "", price: "", description: "" });
    }
  };

  const removePackage = (index) => {
    const updatedPackages = data.packages.filter((_, i) => i !== index);
    onUpdate({ packages: updatedPackages });
  };

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
          Define your hourly rate and service packages
        </p>
      </div>

      <div className="space-y-6 max-w-xl mx-auto">
        <div>
          <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
          <Input
            id="hourlyRate"
            type="number"
            min="0"
            placeholder="50"
            value={data.hourlyRate || ""}
            onChange={(e) => onUpdate({ hourlyRate: parseFloat(e.target.value) || 0 })}
            className="mt-1.5"
          />
          <p className="text-xs text-muted-foreground mt-1.5">
            Your standard hourly rate for services
          </p>
        </div>

        <div className="border-t border-border pt-6">
          <h3 className="font-semibold text-foreground mb-4">Service Packages (Optional)</h3>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="packageName">Package Name</Label>
              <Input
                id="packageName"
                placeholder="e.g., Basic Cleaning"
                value={newPackage.name}
                onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="packagePrice">Package Price ($)</Label>
              <Input
                id="packagePrice"
                type="number"
                min="0"
                placeholder="100"
                value={newPackage.price}
                onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="packageDescription">Package Description</Label>
              <Input
                id="packageDescription"
                placeholder="What's included in this package?"
                value={newPackage.description}
                onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                className="mt-1.5"
              />
            </div>

            <Button
              type="button"
              onClick={addPackage}
              variant="outline"
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Package
            </Button>
          </div>
        </div>

        {data.packages && data.packages.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Your Packages</h3>
            <div className="space-y-3">
              {data.packages.map((pkg, index) => (
                <div
                  key={index}
                  className="p-4 bg-muted rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{pkg.name}</p>
                      <p className="text-lg font-bold text-primary">${pkg.price}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePackage(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  {pkg.description && (
                    <p className="text-sm text-muted-foreground">{pkg.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.hourlyRate > 0 && (
          <div className="p-4 bg-muted rounded-lg mt-6">
            <h3 className="font-semibold text-foreground mb-2">Pricing Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hourly rate:</span>
                <span className="text-foreground font-medium">${data.hourlyRate}/hour</span>
              </div>
              {data.packages && data.packages.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Packages:</span>
                  <span className="text-foreground">{data.packages.length} available</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
