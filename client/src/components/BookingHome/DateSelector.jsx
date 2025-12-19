import React from "react";
import { format, isBefore, isSameDay, addDays } from "date-fns";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Button } from "../ui/button";

function DateSelector({ open, onOpenChange, date, handleSelect, setDate }) {
  return (
    <>
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <div className="flex justify-around shadow-none p-4 cursor-pointer hover:border-black relative before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-px before:bg-gray-300">
            <div>
              <p className="text-xs opacity-75 uppercase">Check-in</p>
              <p className="opacity-80">
                {date?.from ? format(date.from, "MMM dd, yyyy") : "Add date"}
              </p>
            </div>
            <div>
              <p className="text-xs opacity-75 uppercase">Checkout</p>
              <p className="opacity-80">
                {date?.to ? format(date.to, "MMM dd, yyyy") : "Add date"}
              </p>
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-6" align="center">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-bold">Select dates</h2>
              <p className="opacity-75 text-sm">
                Add your travel dates for exact pricing
              </p>
            </div>

            <div className="flex border rounded-lg w-64 overflow-hidden">
              <input
                type="text"
                readOnly
                placeholder="Check-in"
                value={date?.from ? format(date.from, "MMM dd, yyyy") : ""}
                className="w-1/2 px-3 py-1 border-none outline-none cursor-pointer focus:ring-1 focus:ring-black"
              />
              <div className="w-px bg-gray-300"></div>
              <input
                type="text"
                readOnly
                placeholder="Check-out"
                value={date?.to ? format(date.to, "MMM dd, yyyy") : ""}
                className={`w-1/2 px-3 py-1 border-none outline-none cursor-pointer ${
                  !date?.from ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                disabled={!date?.from}
              />
            </div>
          </div>

          <div className="flex justify-end mt-4 space-x-2">
            <button
              className="border-none underline cursor-pointer hover:bg-stone-50 p-2 rounded-lg"
              onClick={() => setDate({ from: undefined, to: undefined })}
            >
              Clear dates
            </button>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}

export default DateSelector;
