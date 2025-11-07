import React, { useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import SelectTimeDialog from "./Modal";

function BookingExperiences() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const arrs = [
    {
      id: 1,
      date: "Tomorrow, October 23",
      time: "8:30 AM - 4:00 PM",
      spots: "30 Spots Available",
    },
    {
      id: 2,
      date: "Monday, October 24",
      time: "9:00 AM - 5:00 PM",
      spots: "25 Spots Available",
    },
    {
      id: 3,
      date: "Tuesday, October 25",
      time: "10:00 AM - 6:00 PM",
      spots: "20 Spots Available",
    },
    {
      id: 4,
      date: "Wednesday, October 26",
      time: "11:00 AM - 7:00 PM",
      spots: "15 Spots Available",
    },
    {
      id: 5,
      date: "Thursday, October 27",
      time: "12:00 PM - 8:00 PM",
      spots: "10 Spots Available",
    },
  ];

  return (
    <>
      <div className=" w-120 m-auto">
        <div className="bg-[#ffffff] shadow-xl py-4 px-10 rounded-t-2xl rounded-b-lg flex justify-between">
          <div>
            <div>
              <strong className="text-lg font-semibold">From 1,664ج.م</strong>{" "}
              <span className="opacity-50">/ guest</span>
            </div>
            <div className="text-[#d90865] font-normal">Free cancellation</div>
          </div>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <button className="bg-[#d90865] text-white py-1 px-5 rounded-full font-medium cursor-pointer">
                show dates
              </button>
            </DialogTrigger>

            <SelectTimeDialog
              open={isModalOpen}
              onOpenChange={setIsModalOpen}
            />
          </Dialog>
        </div>

        <div className="bg-[#ffffff] py-4 px-10 shadow-xl rounded-xl mt-0.5">
          {arrs.map((arr) => (
            <div
              className="border border-solid border-gray-200 p-4 rounded-xl cursor-pointer mb-3"
              key={arr.id}
            >
              <h1 className="font-bold">{arr.date}</h1>
              <div className="flex justify-between mt-2">
                <span className="opacity-50 text-sm">{arr.time}</span>
                <span className="text-sm font-semibold">{arr.spots}</span>
              </div>
            </div>
          ))}

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <h1 className="text-center mt-4 opacity-50 cursor-pointer hover:opacity-100 transition">
                Show all dates
              </h1>
            </DialogTrigger>

            <SelectTimeDialog
              open={isModalOpen}
              onOpenChange={setIsModalOpen}
            />
          </Dialog>
        </div>
      </div>
    </>
  );
}

export default BookingExperiences;
