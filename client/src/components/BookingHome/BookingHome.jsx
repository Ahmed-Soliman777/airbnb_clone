import React, { useState } from "react";
import {
  differenceInDays,
  format,
  isBefore,
  isSameDay,
  subDays,
} from "date-fns";
import DateSelector from "./DateSelector";
import GuestSelector from "./GuestSelector";

function BookingHome() {
  const [openGuests, setOpenGuests] = useState(false);
  const [open, setOpen] = useState(false);

  const [date, setDate] = useState({
    from: undefined,
    to: undefined,
  });
  const [guests, setGuests] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  });

  const nights =
    date?.from && date?.to ? differenceInDays(date.to, date.from) : 0;

  const freeCancelDate = date?.from ? subDays(date.from, 5) : undefined;

  const handleSelect = (range) => {
    if (!range?.from) {
      setDate({ from: undefined, to: undefined });
    } else if (range?.from && !range?.to) {
      setDate({ from: range.from, to: undefined });
    } else if (range?.from && range?.to) {
      if (isSameDay(range.from, range.to)) {
        setDate({ from: range.from, to: undefined });
      } else if (isBefore(range.to, range.from)) {
        setDate({ from: range.from, to: undefined });
      } else {
        setDate(range);
      }
    }
  };

  return (
    <>
      <div className=" p-6 shadow-lg rounded-lg w-100">
        {!date?.from || !date?.to ? (
          <h3 className="font-semibold text-lg">Add dates for prices</h3>
        ) : (
          <h3 className="font-semibold text-lg">
            1,500 ج.م for {nights} night{nights > 1 ? "s" : ""}
          </h3>
        )}

        <div className="border rounded-lg mt-2">
          <div className="border-b">
            {/* Dates popover */}
            <DateSelector
              open={open}
              onOpenChange={setOpen}
              date={date}
              handleSelect={handleSelect}
              setDate={setDate}
            />
          </div>

          {/* Guests Popover */}
          <GuestSelector
            openGuests={openGuests}
            setOpenGuests={setOpenGuests}
            guests={guests}
            setGuests={setGuests}
          />
        </div>

        {date?.from && (
          <p className="text-sm text-gray-700 mt-4 text-center">
            Free cancellation before{" "}
            <span className="font-semibold">
              {format(freeCancelDate, "MMM dd, yyyy")}
            </span>
          </p>
        )}

        <button className="w-80 rounded-full shadow text-center cursor-pointer text-lg flex justify-center mx-auto my-4 py-3 bg-linear-to-r from-rose-600 to-pink-600 font-semibold text-white">
          {date?.from && date?.to ? "Reserve" : "Check availability"}
        </button>

        {date?.from && date?.to && (
          <p className="text-sm text-gray-600 text-center">
            You won't be charged yet
          </p>
        )}
      </div>
    </>
  );
}

export default BookingHome;
