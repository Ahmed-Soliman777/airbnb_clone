import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, X } from "lucide-react";

export default function ServiceAvailabilityStep({ data, onUpdate }) {
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [selectedDays, setSelectedDays] = useState(data.availability || []);

  const toggleDay = (day) => {
    const isSelected = selectedDays.some(d => d.day === day);
    if (isSelected) {
      const updated = selectedDays.filter(d => d.day !== day);
      setSelectedDays(updated);
      onUpdate({ availability: updated });
    } else {
      const updated = [...selectedDays, { day, hours: "9:00 AM - 5:00 PM" }];
      setSelectedDays(updated);
      onUpdate({ availability: updated });
    }
  };

  const updateHours = (day, hours) => {
    const updated = selectedDays.map(d => 
      d.day === day ? { ...d, hours } : d
    );
    setSelectedDays(updated);
    onUpdate({ availability: updated });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-accent-foreground" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          When are you available?
        </h2>
        <p className="text-muted-foreground">
          Set your working days and hours
        </p>
      </div>

      <div className="space-y-4 max-w-xl mx-auto">
        <Label className="mb-3 block">Select Your Working Days</Label>
        
        <div className="space-y-3">
          {daysOfWeek.map((day) => {
            const isSelected = selectedDays.some(d => d.day === day);
            const dayData = selectedDays.find(d => d.day === day);
            
            return (
              <div key={day} className="space-y-2">
                <div
                  onClick={() => toggleDay(day)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected
                      ? "border-primary bg-accent"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{day}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    }`}>
                      {isSelected && (
                        <svg
                          className="w-3 h-3 text-primary-foreground"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
                
                {isSelected && (
                  <div className="ml-4 pl-4 border-l-2 border-primary/30">
                    <Label htmlFor={`hours-${day}`} className="text-sm text-muted-foreground">
                      Working Hours
                    </Label>
                    <input
                      id={`hours-${day}`}
                      type="text"
                      placeholder="9:00 AM - 5:00 PM"
                      value={dayData?.hours || ""}
                      onChange={(e) => updateHours(day, e.target.value)}
                      className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {selectedDays.length > 0 && (
          <div className="p-4 bg-muted rounded-lg mt-6">
            <h3 className="font-semibold text-foreground mb-2">Availability Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Working days:</span>
                <span className="text-foreground font-medium">{selectedDays.length} days/week</span>
              </div>
              <div className="mt-3 space-y-1">
                {selectedDays.map((day) => (
                  <div key={day.day} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{day.day}:</span>
                    <span className="text-foreground">{day.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedDays.length === 0 && (
          <div className="text-center p-8 border-2 border-dashed border-border rounded-lg">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Select the days you're available to provide services
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
