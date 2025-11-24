import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";




export default function AvailabilityStep({ data, onUpdate }) {
    const [selectedDates, setSelectedDates] = useState(data.availability || []);

    const handleDateSelect = (dates) => {
        if (dates) {
            setSelectedDates(dates);
            onUpdate({ availability: dates });
        }
    };


    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
                    <CalendarIcon className="w-8 h-8 text-accent-foreground" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                    Set your availability
                </h2>
                <p className="text-muted-foreground">
                    Select the dates when your property is available for booking
                </p>
            </div>

            <div className="max-w-2xl mx-auto">
                <div className="flex justify-center">
                    <Calendar
                        mode="multiple"
                        selected={selectedDates}
                        onSelect={handleDateSelect}
                        className="rounded-lg border shadow-[var(--shadow-card)] pointer-events-auto"
                        disabled={(date) => date < new Date()}
                    />
                </div>

                {selectedDates.length > 0 && (
                    <div className="mt-6 p-4 bg-accent rounded-lg">
                        <h3 className="font-semibold text-foreground mb-3">
                            Selected dates ({selectedDates.length})
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {selectedDates.slice(0, 5).map((date, index) => (
                                <span
                                    key={index}
                                    className="text-xs bg-card px-2 py-1 rounded text-foreground"
                                >
                                    {format(date, "MMM dd, yyyy")}
                                </span>
                            ))}
                            {selectedDates.length > 5 && (
                                <span className="text-xs text-muted-foreground px-2 py-1">
                                    +{selectedDates.length - 5} more
                                </span>
                            )}
                        </div>
                    </div>
                )}

                <p className="text-sm text-muted-foreground mt-4 text-center">
                    You can update your availability anytime after listing
                </p>
            </div>
        </div>
    );
};