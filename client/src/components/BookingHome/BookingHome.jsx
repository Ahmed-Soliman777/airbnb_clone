import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  differenceInDays,
  format,
  isBefore,
  isSameDay,
  subDays,
} from "date-fns";
import DateSelector from "./DateSelector";
import GuestSelector from "./GuestSelector";
import { useSelector } from "react-redux";

function BookingHome({ listing }) {
  const { loading, error } = useSelector((state) => state.payment);

  const [openGuests, setOpenGuests] = useState(false);
  const [open, setOpen] = useState(false);

  const [date, setDate] = useState({ from: undefined, to: undefined });
  const [guests, setGuests] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  });

  const nights =
    date?.from && date?.to ? differenceInDays(date.to, date.from) : 0;
  const freeCancelDate = date?.from ? subDays(date.from, 5) : undefined;

  // Get price per night from listing
  const pricePerNight = listing?.pricePerNight || 0;
  const totalPrice = pricePerNight * nights;

  const handleSelect = (range) => {
    if (!range?.from) setDate({ from: undefined, to: undefined });
    else if (range?.from && !range?.to)
      setDate({ from: range.from, to: undefined });
    else if (range?.from && range?.to) {
      if (isSameDay(range.from, range.to))
        setDate({ from: range.from, to: undefined });
      else if (isBefore(range.to, range.from))
        setDate({ from: range.from, to: undefined });
      else setDate(range);
    }
  };

  const navigate = useNavigate();

  // Handle Reserve - Go to internal checkout page
  const handleReserve = () => {
    if (!date.from || !date.to || !listing?._id) return;

    const bookingState = {
      type: "listing",
      item: listing,
      checkInDate: date.from,
      checkOutDate: date.to,
      guests, // Pass the full guests object
      totalPrice,
      nights,
      pricePerNight,
    };

    navigate("/checkout", { state: bookingState });
  };

  return (
    <div className="p-6 shadow-lg rounded-lg w-100">
      {!date?.from || !date?.to ? (
        <h3 className="font-semibold text-lg">Add dates for prices</h3>
      ) : (
        <h3 className="font-semibold text-lg">
          ${pricePerNight} for {nights} night{nights > 1 ? "s" : ""}
        </h3>
      )}

      <div className="border rounded-lg mt-2">
        <div className="border-b">
          <DateSelector
            open={open}
            onOpenChange={setOpen}
            date={date}
            handleSelect={handleSelect}
            setDate={setDate}
          />
        </div>

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

      <button
        onClick={handleReserve}
        disabled={loading || !date?.from || !date?.to || !listing}
        className="w-80 rounded-full shadow text-center cursor-pointer text-lg flex justify-center mx-auto my-4 py-3 bg-linear-to-r from-rose-600 to-pink-600 font-semibold text-white disabled:opacity-50"
      >
        {loading
          ? "Processing..."
          : date?.from && date?.to
          ? `Reserve • $${totalPrice}`
          : "Check availability"}
      </button>

      {error && (
        <p className="text-sm text-red-600 text-center mt-2">{error}</p>
      )}

      {date?.from && date?.to && (
        <p className="text-sm text-gray-600 text-center">
          You won't be charged yet
        </p>
      )}
    </div>
  );
}

export default BookingHome;
