import React from "react";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { ChevronDown, ChevronUp } from "lucide-react";
function GuestSelector({ openGuests, setOpenGuests, guests, setGuests }) {
  return (
    <>
      <Popover open={openGuests} onOpenChange={setOpenGuests}>
        <PopoverTrigger asChild>
          <div className="flex justify-between shadow-none p-4 mt-4 cursor-pointer hover:border-black">
            <div>
              <p className="text-xs opacity-75">GUESTS</p>
              <p className="opacity-75">
                {[
                  guests.adults > 0
                    ? `${guests.adults} adult${guests.adults > 1 ? "s" : ""}`
                    : null,
                  guests.children > 0
                    ? `${guests.children} child${
                        guests.children > 1 ? "ren" : ""
                      }`
                    : null,
                  guests.infants > 0
                    ? `${guests.infants} infant${guests.infants > 1 ? "s" : ""}`
                    : null,
                  guests.pets > 0
                    ? `${guests.pets} pet${guests.pets > 1 ? "s" : ""}`
                    : null,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
            <span className="text-lg">
              {openGuests ? <ChevronUp /> : <ChevronDown />}
            </span>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-90">
          <div className="flex justify-between mb-4">
            <div>
              <p className=" font-bold">Adults</p>
              <p className="text-xs">Age 13+</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-lg hover:bg-gray-100 transition"
                onClick={() =>
                  setGuests((prev) => ({
                    ...prev,
                    adults: Math.max(1, prev.adults - 1),
                  }))
                }
              >
                −
              </button>
              <span className="w-5 text-center">{guests.adults}</span>
              <button
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-lg hover:bg-gray-100 transition"
                onClick={() =>
                  setGuests((prev) => ({
                    ...prev,
                    adults: prev.adults + 1,
                  }))
                }
              >
                +
              </button>
            </div>
          </div>
          <div className="flex justify-between mb-4">
            <div>
              <p className=" font-bold">Children</p>
              <p className="text-xs">Ages 2–12</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setGuests((prev) => ({
                    ...prev,
                    children: Math.max(0, prev.children - 1),
                  }))
                }
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-lg hover:bg-gray-100 transition"
              >
                −
              </button>
              <span className="w-5 text-center">{guests.children}</span>
              <button
                onClick={() =>
                  setGuests((prev) => ({
                    ...prev,
                    children: prev.children + 1,
                  }))
                }
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-lg hover:bg-gray-100 transition"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex justify-between mb-4">
            <div>
              <p className=" font-bold">Infants</p>
              <p className="text-xs">Under 2</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setGuests((prev) => ({
                    ...prev,
                    infants: Math.max(0, prev.infants - 1),
                  }))
                }
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-lg hover:bg-gray-100 transition"
              >
                −
              </button>
              <span className="w-5 text-center">{guests.infants}</span>
              <button
                onClick={() =>
                  setGuests((prev) => ({
                    ...prev,
                    infants: prev.infants + 1,
                  }))
                }
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-lg hover:bg-gray-100 transition"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex justify-between mb-4">
            <div>
              <p className=" font-bold">Pets</p>
              <Dialog>
                <DialogTrigger asChild>
                  <p
                    variant="outline"
                    className="underline text-xs cursor-pointer"
                  >
                    Bringing a service animal?
                  </p>
                </DialogTrigger>
                <DialogContent className="w-full h-[600px]">
                  <DialogHeader className="mt-4">
                    <img
                      src="https://a0.muscache.com/pictures/adafb11b-41e9-49d3-908e-049dfd6934b6.jpg"
                      alt=""
                    />
                  </DialogHeader>
                  <div className="">
                    <div className="font-bold text-lg">Service animals</div>

                    <span>
                      Service animals aren’t pets, so there’s no need to add
                      them here.
                      <span>
                        Traveling with an emotional support animal? Check out
                        our
                      </span>
                      <div>
                        <a
                          href="https://www.airbnb.com/help/article/1680/service-animals-and-emotional-support-animals"
                          target="_blank"
                          className="underline inline-block ml-1"
                        >
                          accessibility policy
                        </a>
                      </div>
                    </span>
                  </div>
                  <DialogFooter className="sm:justify-start"></DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setGuests((prev) => ({
                    ...prev,
                    pets: Math.max(0, prev.pets - 1),
                  }))
                }
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-lg hover:bg-gray-100 transition"
              >
                −
              </button>
              <span className="w-5 text-center">{guests.pets}</span>
              <button
                onClick={() =>
                  setGuests((prev) => ({ ...prev, pets: prev.pets + 1 }))
                }
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-lg hover:bg-gray-100 transition"
              >
                +
              </button>
            </div>
          </div>
          <div className="text-xs">
            This place has a maximum of 1 guest, not including infants. Pets
            aren't allowed.
          </div>
          <div className="flex justify-end mt-4">
            <button
              className="border-none right-0 underline cursor-pointer hover:bg-stone-50 p-2 rounded-lg"
              onClick={() => setOpenGuests(false)}
            >
              close
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}

export default GuestSelector;
