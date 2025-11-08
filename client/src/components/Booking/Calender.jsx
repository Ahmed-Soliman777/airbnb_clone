import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { useState } from "react";

function CalendarModal() {
  const [date, setDate] = useState(null);
  const today = new Date();

  return (
    <div className="flex flex-row-reverse justify-between items-center gap-4 px-4  ">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[450px] p-6">
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border p-4 scale-110"
            />
          </div>

          <DialogFooter className="flex justify-center mt-4">
            {date && (
              <DialogClose asChild>
                <Button className="w-1/2 mx-auto">Next</Button>
              </DialogClose>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <p className="text-lg font-medium">
        {format(date || today, "MMMM yyyy")}
      </p>
    </div>
  );
}
export default CalendarModal;
