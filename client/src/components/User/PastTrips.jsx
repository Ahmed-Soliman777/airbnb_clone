import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserBookings } from '../../store/Slices/bookingSlice';
import { FaCalendarAlt, FaMoneyBillWave, FaMapMarkerAlt, FaUsers, FaArrowRight } from 'react-icons/fa';
import moment from 'moment';
import { Link } from 'react-router-dom';

//  component to display a single trip card
const TripCard = ({ booking, isUpcoming = false }) => {
    // Check if listing was successfully populated by the backend
    if (!booking.listing) {
        return <div className="p-4 bg-red-100 text-red-700 rounded-lg">Error: Listing data not found for this booking.</div>;
    }

    const { checkInDate, checkOutDate, totalPrice, guestsCount, status } = booking;
    const listing = booking.listing;

    // Extract listing details
    const listingTitle = listing.title || 'Unknown Listing';
    // Access location property correctly (if it's an object/string)
    const listingLocation = (listing.location && listing.location.address) || listing.location || 'Unknown Location';

    // Determine the main photo URL
    const listingPhoto = (listing.images && listing.images.length > 0)
        ? listing.images[0].url || listing.images[0]
        : '/default-house.jpg';

    // Calculate duration in days
    const duration = moment(checkOutDate).diff(moment(checkInDate), 'days');

    // Determine status color and text
    let statusColor = 'text-green-600';
    if (status === 'pending') statusColor = 'text-yellow-600';
    if (status === 'cancelled') statusColor = 'text-red-600';

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 transition duration-300 hover:shadow-xl flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">

            {/* Image Section */}
            <div className="md:w-1/3 flex-shrink-0">
                <img
                    src={listingPhoto}
                    alt={listingTitle}
                    className="w-full h-48 object-cover rounded-lg"
                />
            </div>

            {/* Details Section */}
            <div className="md:w-2/3 space-y-3">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-800">{listingTitle}</h3>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusColor.replace('text', 'bg').replace('-600', '-100')} ${statusColor}`}>
                        {status}
                    </span>
                </div>

                <p className="text-sm text-gray-500 flex items-center">
                    <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                    {listingLocation}
                </p>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 border-t pt-3">
                    <div className="text-sm">
                        <p className="font-medium text-gray-700 flex items-center">
                            <FaCalendarAlt className="w-4 h-4 mr-2 text-blue-500" />
                            {isUpcoming ? 'Check-in Date' : 'Stayed'}
                        </p>
                        <p className="text-gray-600 mt-1">
                            {moment(checkInDate).format('MMM D, YYYY')} - {moment(checkOutDate).format('MMM D, YYYY')}
                            <span className="ml-2 text-xs text-gray-500">({duration} nights)</span>
                        </p>
                    </div>

                    <div className="text-sm">
                        <p className="font-medium text-gray-700 flex items-center">
                            <FaMoneyBillWave className="w-4 h-4 mr-2 text-green-500" />
                            Total Paid
                        </p>
                        <p className="text-gray-600 mt-1 font-bold">${totalPrice.toFixed(2)}</p>
                    </div>

                    <div className="text-sm">
                        <p className="font-medium text-gray-700 flex items-center">
                            <FaUsers className="w-4 h-4 mr-2 text-indigo-500" />
                            Guests
                        </p>
                        <p className="text-gray-600 mt-1">{guestsCount}</p>
                    </div>

                    {/* Action Button */}
                    <Link
                        to={`/room/${listing._id}`}
                        className="col-span-2 mt-2 px-4 py-2 text-sm text-blue-600 font-semibold border border-blue-600 rounded-lg hover:bg-blue-50 flex items-center justify-center transition"
                    >
                        View Listing
                        <FaArrowRight className="w-3 h-3 ml-2" />
                    </Link>
                </div>
            </div>
        </div>
    );
};


const PastTrips = () => {
    const dispatch = useDispatch();
    const { bookings, status, error } = useSelector((state) => state.booking);


    const safeBookings = Array.isArray(bookings) ? bookings : [];
    const bookingsLoading = status === "loading";

    useEffect(() => {
        // Fetch bookings only if not already loaded and the array is empty
        if (!bookingsLoading && safeBookings.length === 0) {
            dispatch(fetchUserBookings());
        }
    }, [dispatch, bookingsLoading, safeBookings.length]);
    if (bookingsLoading && safeBookings.length === 0) {
        return <div className="p-6 text-center text-blue-600 font-semibold">Loading your trip history...</div>;
    }

    if (error) {
        return <div className="p-6 text-center text-red-600 font-semibold">Error retrieving trips: {error}</div>;
    }

    // 💡 Logic to separate trips into Past and Upcoming, باستخدام المصفوفة الآمنة
    const now = moment();

    // Trip is PAST if Check-out date is strictly BEFORE today
    const pastTrips = safeBookings.filter(booking =>
        moment(booking.checkOutDate).isBefore(now, 'day')
    );

    // Trip is UPCOMING if Check-out date is today OR after
    const upcomingTrips = safeBookings.filter(booking =>
        moment(booking.checkOutDate).isSameOrAfter(now, 'day')
    );

    if (safeBookings.length === 0 && !bookingsLoading) {
        return (
            <div className="p-8 text-center bg-white min-h-screen">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-2">Your Trips</h1>
                <div className="p-10 border border-gray-200 rounded-lg bg-gray-50 mt-10">
                    <p className="text-xl font-semibold text-gray-700">No Trips Found</p>
                    <p className="text-gray-500 mt-2">Looks like you haven't booked any trips yet. Start your adventure now!</p>
                </div>
            </div>
        );
    }


    return (
        <div className="p-4 md:p-8 bg-white min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-2">Your Trips</h1>

            {/* Upcoming Trips Section */}
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Upcoming Trips ({upcomingTrips.length})</h2>
            <div className="space-y-6 mb-12">
                {upcomingTrips.length > 0 ? (
                    upcomingTrips.map(booking => (
                        <TripCard key={booking._id} booking={booking} isUpcoming={true} />
                    ))
                ) : (
                    <div className="p-6 text-gray-600 border border-gray-200 rounded-lg bg-gray-50 text-center">
                        <p className="font-medium">You have no upcoming trips booked at the moment.</p>
                        <p className="text-sm mt-1">Ready for an adventure? Start browsing new listings!</p>
                    </div>
                )}
            </div>

            {/* Past Trips Section */}
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-t pt-6">Past Trips ({pastTrips.length})</h2>
            <div className="space-y-6">
                {pastTrips.length > 0 ? (
                    pastTrips.map(booking => (
                        <TripCard key={booking._id} booking={booking} isUpcoming={false} />
                    ))
                ) : (
                    <div className="p-6 text-gray-600 border border-gray-200 rounded-lg bg-gray-50 text-center">
                        <p className="font-medium">You haven't completed any trips yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PastTrips;