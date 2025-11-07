import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CalendarModal from "./Calender";

function SelectTimeDialog({ open, onOpenChange }) {
  const [adults, setAdults] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleAdultChange = (change) => {
    setAdults((prev) => Math.max(1, prev + change));
  };

  const arrs = [
    {
      id: 1,
      date: "Tomorrow, October 23",
      pricePerGuest: 1653,
      time: "8:30 AM - 4:00 PM",
      privatePrice: "Private pricing available",
      spots: "30 Spots Available",
    },
    {
      id: 2,
      date: "Monday, October 24",
      pricePerGuest: 1653,
      time: "9:00 AM - 5:00 PM",
      privatePrice: "Private pricing available",
      spots: "25 Spots Available",
    },
    {
      id: 3,
      date: "Tuesday, October 25",
      pricePerGuest: 1653,
      time: "10:00 AM - 6:00 PM",
      privatePrice: "Private pricing available",
      spots: "20 Spots Available",
    },
    {
      id: 4,
      date: "Wednesday, October 26",
      pricePerGuest: 1653,
      time: "11:00 AM - 7:00 PM",
      privatePrice: "Private pricing available",
      spots: "15 Spots Available",
    },
    {
      id: 5,
      date: "Thursday, October 27",
      pricePerGuest: 1653,
      time: "12:00 PM - 8:00 PM",
      privatePrice: "Private pricing available",
      spots: "10 Spots Available",
    },
  ];

  const totalPrice = selectedItem ? selectedItem.pricePerGuest * adults : 0;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) {
          setSelectedItem(null);
          setAdults(1);
        }
      }}
    >
      <DialogContent className="max-w-[800px] p-0 overflow-hidden rounded-lg">
        <DialogHeader className="p-4 border-b flex flex-row items-center justify-between">
          <h1 className="text-xl font-bold text-[30px]">Select a time</h1>
        </DialogHeader>

        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <p className="font-bold text-lg">
              <span className="font-semibold">
                {adults} adult{adults > 1 ? "s" : ""}
              </span>
            </p>
            <p className="text-xs text-muted-foreground">Age 13+</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleAdultChange(-1)}
              disabled={adults <= 1}
            >
              -
            </Button>
            <span className="w-6 text-center">{adults}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleAdultChange(1)}
            >
              +
            </Button>
          </div>
        </div>

        <div className="p-2">
          <CalendarModal />
        </div>

        <div className="bg-[#ffffff] py-3 px-8 shadow-inner border-t border-gray-200  overflow-y-auto max-h-[550px]">
          {arrs.map((arr) => (
            <div key={arr.id} className="mb-6">
              <h1 className="font-bold mb-3 text-lg">{arr.date}</h1>
              <div
                onClick={() => setSelectedItem(arr)}
                className={`border border-solid p-4 rounded-xl cursor-pointer transition ${
                  selectedItem?.id === arr.id
                    ? "border-gray-500 "
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <p className="text-lg">{arr.time}</p>
                <p className="text-sm mt-0 opacity-80">
                  {arr.pricePerGuest.toLocaleString()} ج.م/guest
                </p>
                <div className="flex justify-between mt-0">
                  <span className="text-sm opacity-75">{arr.privatePrice}</span>
                  <span className="text-xs opacity-75">{arr.spots}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedItem && (
          <DialogFooter className="flex! flex-row! justify-between! items-center! p-4 border-t bg-white">
            <div>
              <p className="font-medium text-gray-700">
                {totalPrice.toLocaleString()} ج.م{" "}
                <span className="text-sm opacity-70">
                  for {adults} guest{adults > 1 ? "s" : ""}
                </span>
              </p>
            </div>
            <Button className="px-8 rounded-full">Next</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
export default SelectTimeDialog;
