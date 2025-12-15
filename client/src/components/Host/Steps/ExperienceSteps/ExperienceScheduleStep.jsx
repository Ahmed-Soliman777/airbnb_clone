import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, X } from "lucide-react";

export default function ExperienceScheduleStep({ data, onUpdate }) {
  const [newSchedule, setNewSchedule] = useState({ day: "", startTime: "", endTime: "" });

  const addSchedule = () => {
    if (newSchedule.day && newSchedule.startTime && newSchedule.endTime) {
      onUpdate({
        schedule: [...(data.schedule || []), newSchedule],
      });
      setNewSchedule({ day: "", startTime: "", endTime: "" });
    }
  };

  const removeSchedule = (index) => {
    const updatedSchedule = data.schedule.filter((_, i) => i !== index);
    onUpdate({ schedule: updatedSchedule });
  };

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-accent-foreground" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          When can guests book?
        </h2>
        <p className="text-muted-foreground">
          Set your available days and times
        </p>
      </div>

      <div className="space-y-6 max-w-xl mx-auto">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="day">Day of Week</Label>
              <select
                id="day"
                value={newSchedule.day}
                onChange={(e) => setNewSchedule({ ...newSchedule, day: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-1.5"
              >
                <option value="">Select day</option>
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={newSchedule.startTime}
                onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={newSchedule.endTime}
                onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
                className="mt-1.5"
              />
            </div>
          </div>

          <Button
            type="button"
            onClick={addSchedule}
            variant="outline"
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Time Slot
          </Button>
        </div>

        {data.schedule && data.schedule.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Available Time Slots</h3>
            <div className="space-y-2">
              {data.schedule.map((slot, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{slot.day}</p>
                    <p className="text-sm text-muted-foreground">
                      {slot.startTime} - {slot.endTime}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSchedule(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {(!data.schedule || data.schedule.length === 0) && (
          <div className="text-center p-8 border-2 border-dashed border-border rounded-lg">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No time slots added yet. Add your first availability above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
