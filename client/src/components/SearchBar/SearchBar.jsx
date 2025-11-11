import { SearchIcon } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { Calendar } from '../ui/calendar'
import './SearchBar.css'
import GuestCount from '../GuestCount/GuestCount'

export default function SearchBar() {

    // add calendarRef if mouse is clicked outside the calendar
    const calendarRef = useRef(null)

    const guestRef = useRef(null);

    // add state for caledar
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)

    const [isGuestOpen, setIsGuestOpen] = useState(false);

    const [guestSummary, setGuestSummary] = useState("Add guests");

    // add state to handle checkin and checkout date range
    const [dateRange, setDateRange] = useState({
        from: new Date(),
        to: new Date(),
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

        <div className='pb-2'>

            {/* search bar form container */}

            <form className='flex items-center justify-center bg-white lg:w-[63%] md:w-full rounded-full py-2  mx-auto mt-3 gap-1 transition-all'>

                {/* Search destination input container */}

                <div className="flex flex-col rounded-full hover:bg-(--color-light-gray) px-5 py-1 cursor-pointer">
                    <label>Where</label>
                    <input type="text" placeholder='Search destinations' className='outline-0' />
                </div>

                {/* check in date input container */}

                <div onClick={() => setIsCalendarOpen(prev => !prev)} className="flex flex-col rounded-full hover:bg-(--color-light-gray) px-5 py-1 cursor-pointer  relative">
                    <label className='pointer-events-none'>Check in</label>
                    <input type="text" placeholder='Add dates' readOnly className='pointer-events-none' value={formatDate(dateRange.from)} />
                    {isCalendarOpen && <div className="absolute top-17" ref={calendarRef}>  <Calendar
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                        className="rounded-lg border shadow-sm"
                    /></div>}
                </div>

                {/* check out date input container */}

                <div onClick={() => setIsCalendarOpen(prev => !prev)} className="flex flex-col rounded-full hover:bg-(--color-light-gray) px-5 py-1 cursor-pointer relative">
                    <label className='pointer-events-none'>Check out</label>
                    <input type="text" placeholder='Add dates' readOnly className='pointer-events-none' value={formatDate(dateRange.to)} />
                    {/* {isClicked && <div className="absolute top-17"> <Calendar /></div>} */}
                </div>

                {/* add guests input container */}

                <div className="flex flex-col rounded-full hover:bg-(--color-light-gray) px-5 py-1 relative cursor-pointer " ref={guestRef} >
                    <div onClick={() => setIsGuestOpen(prev => !prev)}>
                        <label className='pointer-events-none'>Who</label>
                        <input type="text" placeholder='Add guests' readOnly className='pointer-events-none' value={guestSummary} />

                        {/* search btn */}

                        <button className="p-3 rounded-full bg-(--color-primary) absolute start-42 top-1.5 hover:bg-(--color-primary-hover) cursor-pointer"
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
                        </button>

                        {/* GuestCount component */}

                    </div>
                    {isGuestOpen && (
                        <div className="absolute top-17 z-20">
                            <GuestCount setGuestSummary={setGuestSummary} />
                        </div>
                    )}
                </div>
            </form>
        </div >
    )
}
