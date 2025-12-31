import { SearchIcon } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { Calendar } from '../ui/calendar'
import i18n from '../../utils/i18n'
import { useTranslation } from "react-i18next";
import './SearchBar.css'
import GuestCount from '../GuestCount/GuestCount'
// import SearchCity from '../SearchCity/SearchCity'
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';

export default function SearchBar() {

    const { t } = useTranslation()
    const location = useLocation();

    // Determine search type based on current page
    const getSearchType = () => {
        if (location.pathname.startsWith('/experiences')) return 'experience';
        if (location.pathname.startsWith('/services')) return 'service';
        return 'home';
    };

    const searchType = getSearchType();
    const isHomeSearch = searchType === 'home';

    // update language state 
    const lang = useSelector(state => state.lang.default_language);

    // make component render again if language changes
    useEffect(() => {
        i18n.changeLanguage(lang);
    }, [lang]);

    // add calendarRef if mouse is clicked outside the calendar
    const checkInRef = useRef(null)
    const checkOutRef = useRef(null)
    const dateRef = useRef(null)

    const guestRef = useRef(null);

    const cityRef = useRef(null);

    const [whereInput, setWhereInput] = useState("");

    // add state for calendar
    const [isCheckinOpen, setIsCheckinOpen] = useState(false)
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
    const [isDateOpen, setIsDateOpen] = useState(false)

    const [isGuestOpen, setIsGuestOpen] = useState(false);

    const [isCityOpen, setIsCityOpen] = useState(false);

    const [guestSummary, setGuestSummary] = useState("");

    // add state to handle checkin and checkout date range
    const [dateRange, setDateRange] = useState({
        from: null,
        to: null,
    })

    // Single date for experiences/services
    const [selectedDate, setSelectedDate] = useState(null);

    // add useEffect to control the initial state of calendar and to be false when page is rerendered
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                checkInRef.current &&
                !checkInRef.current.contains(event.target)
            ) {
                setIsCheckinOpen(false)
            }
            if (
                checkOutRef.current &&
                !checkOutRef.current.contains(event.target)
            ) {
                setIsCheckoutOpen(false)
            }
            if (
                dateRef.current &&
                !dateRef.current.contains(event.target)
            ) {
                setIsDateOpen(false)
            }
        }

        if (isCheckinOpen || isCheckoutOpen || isDateOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        } else {
            document.removeEventListener('mousedown', handleClickOutside)
        }

        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isCheckinOpen, isCheckoutOpen, isDateOpen])

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

    const navigate = useNavigate();

    const handleSearch = () => {
        const city = whereInput?.trim() || "";
        const guests = guestSummary?.trim() || "";

        if (isHomeSearch) {
            const checkIn = dateRange?.from
                ? new Date(dateRange.from).toISOString()
                : "";

            const checkOut = dateRange?.to
                ? new Date(dateRange.to).toISOString()
                : "";

            const queryParams = new URLSearchParams({
                city,
                checkIn,
                checkOut,
                guests,
            }).toString();

            navigate(`/search?${queryParams}`);
        } else {
            const date = selectedDate
                ? new Date(selectedDate).toISOString()
                : "";

            const queryParams = new URLSearchParams({
                city,
                date,
                guests,
            }).toString();

            if (searchType === 'experience') {
                navigate(`/experiences/search?${queryParams}`);
            } else {
                navigate(`/services/search?${queryParams}`);
            }
        }
    };

    // Calendar handler for home (range)
    const handleDateSelect = (selectedRange) => {
        if (!selectedRange) return;

        if (isCheckinOpen) {
            setDateRange(prev => ({
                ...prev,
                from: selectedRange.from,
                to: prev.to && selectedRange.from > prev.to ? null : prev.to
            }));

            setIsCheckinOpen(false);
            setIsCheckoutOpen(true);
        }

        if (isCheckoutOpen) {
            setDateRange(prev => ({
                ...prev,
                to: selectedRange.to
            }));

            if (selectedRange.to) {
                setIsCheckoutOpen(false);
            }
        }
    };

    // Single date handler for experiences/services
    const handleSingleDateSelect = (date) => {
        setSelectedDate(date);
        setIsDateOpen(false);
    };

    // Get labels based on search type
    const getDateLabel = () => {
        if (searchType === 'experience') return "Date";
        if (searchType === 'service') return "Date";
        return t("searchBar.checkin");
    };

    const getGuestLabel = () => {
        if (searchType === 'experience') return t("searchBar.guests") || "Guests";
        if (searchType === 'service') return t("searchBar.guests") || "Guests";
        return t("searchBar.who");
    };


    return (

        // search bar container

        <div className='pb-2 px-2 sm:px-4'>

            {/* search bar form container */}

            <form className='flex flex-col sm:flex-row items-center justify-center bg-white w-full sm:w-[95%] lg:w-[63%] rounded-lg sm:rounded-full py-3 sm:py-2 mx-auto gap-2 sm:gap-1 transition-all shadow-sm'>

                {/* Search destination input container */}

                <div
                    className="relative w-full sm:flex-1 min-w-0"
                    ref={cityRef}
                >
                    <div
                        className="flex flex-col rounded-lg sm:rounded-full hover:bg-gray-100 px-4 sm:px-5 py-2 sm:py-1 cursor-pointer"
                        onClick={() => setIsCityOpen(true)}
                    >
                        <label className="text-xs sm:text-sm font-medium">{t("searchBar.where")}</label>
                        <input
                            type="text"
                            className="outline-0 text-sm bg-transparent truncate"
                            placeholder={t("searchBar.search_destination")}
                            value={whereInput}
                            onChange={(e) => {
                                setWhereInput(e.target.value);
                                setIsCityOpen(true);
                            }}
                        />
                    </div>

                    {/* {isCityOpen && (
                        <div className="absolute top-full mt-2 z-50 w-full">
                            <SearchCity
                                whereInput={whereInput}
                                onSelectCity={(city) => {
                                    setWhereInput(city);
                                    setIsCityOpen(false);
                                }}
                            />
                        </div>
                    )} */}
                </div>

                {/* Date inputs - conditional based on search type */}
                {isHomeSearch ? (
                    <>
                        {/* check in date input container */}
                        <div className="relative w-full sm:flex-1 min-w-0">
                            <div
                                className="flex flex-col rounded-lg sm:rounded-full hover:bg-gray-100 px-4 sm:px-5 py-2 sm:py-1 cursor-pointer"
                                onClick={() => {
                                    setIsCheckinOpen(true);
                                    setIsCheckoutOpen(false);
                                }}

                            >
                                <label className="text-xs sm:text-sm font-medium">{t("searchBar.checkin")}</label>
                                <input
                                    readOnly
                                    className="text-sm bg-transparent truncate"
                                    placeholder={t("searchBar.add_dates")}
                                    value={formatDate(dateRange.from)}
                                />
                            </div>

                            {isCheckinOpen && (
                                <div ref={checkInRef} className="absolute top-full mt-2 z-50">
                                    <Calendar
                                        mode="range"
                                        selected={dateRange}
                                        onSelect={handleDateSelect}
                                        numberOfMonths={2}
                                        className="rounded-lg border shadow-sm bg-white pointer-events-auto"
                                    />
                                </div>
                            )}
                        </div>

                        {/* check out date input container */}
                        <div className="relative w-full sm:flex-1 min-w-0">
                            <div
                                className="flex flex-col rounded-lg sm:rounded-full hover:bg-gray-100 px-4 sm:px-5 py-2 sm:py-1 cursor-pointer"
                                onClick={() => {
                                    setIsCheckoutOpen(true);
                                    setIsCheckinOpen(false);
                                }}

                            >
                                <label className="text-xs sm:text-sm font-medium">{t("searchBar.checkout")}</label>
                                <input
                                    readOnly
                                    className="text-sm bg-transparent truncate"
                                    placeholder={t("searchBar.add_dates")}
                                    value={formatDate(dateRange.to)}
                                />
                            </div>

                            {isCheckoutOpen && (
                                <div ref={checkOutRef} className="absolute top-full mt-2 z-50">
                                    <Calendar
                                        mode="range"
                                        selected={dateRange}
                                        onSelect={handleDateSelect}
                                        numberOfMonths={2}
                                        className="rounded-lg border shadow-sm bg-white pointer-events-auto"
                                    />
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    /* Single date input for experiences/services */
                    <div className="relative w-full sm:flex-1 min-w-0" ref={dateRef}>
                        <div
                            className="flex flex-col rounded-lg sm:rounded-full hover:bg-gray-100 px-4 sm:px-5 py-2 sm:py-1 cursor-pointer"
                            onClick={() => setIsDateOpen(true)}
                        >
                            <label className="text-xs sm:text-sm font-medium">{getDateLabel()}</label>
                            <input
                                readOnly
                                className="text-sm bg-transparent truncate"
                                placeholder={t("searchBar.add_dates") || "Add date"}
                                value={formatDate(selectedDate)}
                            />
                        </div>

                        {isDateOpen && (
                            <div className="absolute top-full mt-2 z-50">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={handleSingleDateSelect}
                                    className="rounded-lg border shadow-sm bg-white pointer-events-auto"
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* add guests input container */}

                <div className="relative w-full sm:flex-1 min-w-0" ref={guestRef}>
                    <div
                        className="flex flex-col rounded-lg sm:rounded-full hover:bg-gray-100 px-4 sm:px-5 py-2 sm:py-1 cursor-pointer"
                        onClick={() => setIsGuestOpen(true)}
                    >
                        <label className="text-xs sm:text-sm font-medium">{getGuestLabel()}</label>
                        <input
                            type="text"
                            readOnly
                            className="text-sm bg-transparent truncate"
                            placeholder={t("searchBar.guests")}
                            value={guestSummary}
                        />
                    </div>

                    {isGuestOpen && (
                        <div className="absolute top-full mt-2 z-50">
                            <GuestCount setGuestSummary={setGuestSummary} />
                        </div>
                    )}
                </div>


                {/* search btn */}

                <button className="p-2 sm:p-2.5 rounded-lg sm:rounded-full bg-(--color-primary) hover:bg-(--color-primary-hover) cursor-pointer transition-colors w-[95%] sm:w-auto sm:shrink-0 flex items-center justify-center gap-2 sm:gap-0 mx-auto lg:me-3 md:me-2"
                    type='button'
                    onClick={handleSearch}
                >
                    <SearchIcon color={'white'} size={20} />
                    <span className='sm:hidden text-white text-sm font-medium'>Search</span>
                </button>
            </form>
        </div >
    )
}