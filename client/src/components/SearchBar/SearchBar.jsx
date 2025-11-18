import { SearchIcon } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { Calendar } from '../ui/calendar'
import './SearchBar.css'
import GuestCount from '../GuestCount/GuestCount'
import SearchCity from '../SearchCity/SearchCity'

export default function SearchBar() {
    // add calendarRef if mouse is clicked outside the calendar
    const calendarRef = useRef(null)

    const guestRef = useRef(null);

    const cityRef = useRef(null);

    const [whereInput, setWhereInput] = useState("");

    // add state for caledar
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)

    const [isGuestOpen, setIsGuestOpen] = useState(false);

    const [isCityOpen, setIsCityOpen] = useState(false);

    const [guestSummary, setGuestSummary] = useState("Add guests");

    // add state to handle checkin and checkout date range
    const [dateRange, setDateRange] = useState({
        from: null,
        to: null,
    })

    // add useEffect to controll the initial state of calendar and to be false when page is rerendered
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                calendarRef.current &&
                !calendarRef.current.contains(event.target)
            ) {
                setIsCalendarOpen(false)
            }
        }

        if (isCalendarOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        } else {
            document.removeEventListener('mousedown', handleClickOutside)
        }

        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isCalendarOpen])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (guestRef.current && !guestRef.current.contains(event.target)) {
                setIsGuestOpen(false);
            }
        };

        if (isGuestOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isGuestOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                cityRef.current &&
                !cityRef.current.contains(event.target)
            ) {
                setIsCityOpen(false)
            }
        }

        if (isCityOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        } else {
            document.removeEventListener('mousedown', handleClickOutside)
        }

        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isCityOpen])

    // this function to read date from calendar to dates input elements
    const formatDate = (date) => {
        if (!date) return ""
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        })
    }

    return (

        // search bar container

        <div className='pb-2 px-2 sm:px-4'>

            {/* search bar form container */}

            <form className='flex flex-col sm:flex-row items-center justify-center bg-white w-full sm:w-[95%] lg:w-[63%] rounded-lg sm:rounded-full py-3 sm:py-2 mx-auto gap-2 sm:gap-1 transition-all shadow-sm'>

                {/* Search destination input container */}

                <div
                    className="flex flex-col rounded-lg sm:rounded-full hover:bg-gray-100 px-4 sm:px-5 py-2 sm:py-1 relative cursor-pointer w-full sm:flex-1 min-w-0"
                    ref={cityRef}
                >
                    <div
                        className="flex flex-col rounded-lg sm:rounded-full hover:bg-gray-100 px-4 sm:px-5 py-2 sm:py-1 cursor-pointer w-full sm:flex-1 min-w-0"
                    >
                        <label className="text-xs sm:text-sm font-medium">Where</label>
                        <input
                            type="text"
                            placeholder="Search destinations"
                            className="outline-0 text-sm bg-transparent truncate"
                            value={whereInput}
                            onChange={(e) => {
                                setWhereInput(e.target.value); // update input
                                setIsCityOpen(true); // open dropdown when typing
                            }}
                            onClick={() => setIsCityOpen(true)} // keep click toggle
                        />
                    </div>

                    {isCityOpen && (
                        <div className="absolute top-full mt-2 sm:top-17 left-0 sm:left-auto z-50 w-full sm:w-auto">
                            <SearchCity
                                whereInput={whereInput} // pass input for filtering
                                onSelectCity={(city) => {
                                    setWhereInput(city); // select city
                                    setIsCityOpen(false); // close dropdown
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* check in date input container */}

                <div onClick={() => setIsCalendarOpen(prev => !prev)} className="flex flex-col rounded-lg sm:rounded-full hover:bg-gray-100 px-4 sm:px-5 py-2 sm:py-1 cursor-pointer relative w-full sm:flex-1 min-w-0">
                    <label className='pointer-events-none text-xs sm:text-sm font-medium'>Check in</label>
                    <input type="text" placeholder='Add dates' readOnly className='pointer-events-none text-sm bg-transparent truncate' value={formatDate(dateRange.from)} />
                    {isCalendarOpen && <div className="absolute top-full mt-2 sm:top-17 left-0 sm:left-auto z-50" ref={calendarRef}>  <Calendar
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                        className="rounded-lg border shadow-sm"
                    /></div>}
                </div>

                {/* check out date input container */}

                <div onClick={() => setIsCalendarOpen(prev => !prev)} className="flex flex-col rounded-lg sm:rounded-full hover:bg-gray-100 px-4 sm:px-5 py-2 sm:py-1 cursor-pointer relative w-full sm:flex-1 min-w-0">
                    <label className='pointer-events-none text-xs sm:text-sm font-medium'>Check out</label>
                    <input type="text" placeholder='Add dates' readOnly className='pointer-events-none text-sm bg-transparent truncate' value={formatDate(dateRange.to)} />
                </div>

                {/* add guests input container */}

                <div className="flex flex-col rounded-lg sm:rounded-full hover:bg-gray-100 px-4 sm:px-5 py-2 sm:py-1 relative cursor-pointer w-full sm:flex-1 min-w-0" ref={guestRef} >
                    <div onClick={() => setIsGuestOpen(prev => !prev)}>
                        <label className='pointer-events-none text-xs sm:text-sm font-medium'>Who</label>
                        <input type="text" placeholder='Add guests' readOnly className='pointer-events-none text-sm bg-transparent truncate' value={guestSummary} />

                        {/* GuestCount component */}

                    </div>
                    {isGuestOpen && (
                        <div className="absolute top-full mt-2 sm:top-17 left-0 sm:left-auto z-50 w-full sm:w-auto">
                            <GuestCount setGuestSummary={setGuestSummary} />
                        </div>
                    )}
                </div>

                {/* search btn */}

                <button className="p-2 sm:p-2.5 rounded-lg sm:rounded-full bg-(--color-primary) hover:bg-(--color-primary-hover) cursor-pointer transition-colors w-[95%] sm:w-auto sm:shrink-0 flex items-center justify-center gap-2 sm:gap-0 mx-auto lg:me-3 md:me-2"
                    type='button'
                    onClick={() => {
                        console.log({
                            location: document.querySelector('input[placeholder="Search destinations"]').value,
                            checkIn: dateRange.from,
                            checkOut: dateRange.to,
                            guests: guestSummary,
                        });
                    }}
                >
                    <SearchIcon color={'white'} size={20} />
                    <span className='sm:hidden text-white text-sm font-medium'>Search</span>
                </button>
            </form>
        </div >
    )
}