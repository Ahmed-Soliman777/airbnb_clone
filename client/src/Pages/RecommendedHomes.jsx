import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateRecommendations } from '../utils/generateRecommendations';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

const RecommendedHomes = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [homes, setHomes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const filters = location.state?.filters || {};

    useEffect(() => {
        fetchRecommendedHomes();
    }, []);

    const fetchRecommendedHomes = async () => {
        try {
            setLoading(true);
            // Use the generateRecommendations utility function
            const recommendedHomes = await generateRecommendations(filters);
            setHomes(recommendedHomes);
            setError(null);
        } catch (err) {
            console.error('Error fetching homes:', err);
            setError(err.message || 'Failed to load recommended homes. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToFilters = () => {
        navigate('/ai-recommendation');
    };

    const handleViewDetails = (homeId) => {
        navigate(`/room/${homeId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#FF385C] border-r-transparent"></div>
                    <p className="mt-4 text-lg text-gray-600">Finding your perfect stays...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-5">
                <div className="max-w-md text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Oops!</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={fetchRecommendedHomes}
                        className="px-6 py-3 bg-gradient-to-br from-[#FF385C] to-[#E31C5F] text-white font-semibold rounded-lg hover:from-[#E31C5F] hover:to-[#FF385C] transition-all"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-10 px-5">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={handleBackToFilters}
                        className="flex items-center gap-2 text-gray-600 hover:text-[#FF385C] transition-colors mb-4"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        Back to Filters
                    </button>

                    <h1 className="text-4xl font-semibold text-gray-900 mb-2">
                        Recommended Homes
                    </h1>
                    <p className="text-gray-600">
                        We found {homes.length} {homes.length === 1 ? 'home' : 'homes'} that match your preferences
                        {filters.city && ` in ${filters.city}`}
                    </p>

                    {/* Active Filters */}
                    {(filters.city || filters.propertyType || filters.amenities?.length > 0 || filters.pricePerNight?.min || filters.pricePerNight?.max) && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {filters.city && (
                                <span className="px-3 py-1 bg-[#FF385C]/10 text-[#FF385C] rounded-full text-sm font-medium">
                                    {filters.city}
                                </span>
                            )}
                            {filters.propertyType && (
                                <span className="px-3 py-1 bg-[#FF385C]/10 text-[#FF385C] rounded-full text-sm font-medium">
                                    {filters.propertyType}
                                </span>
                            )}
                            {filters.amenities?.length > 0 && (
                                <span className="px-3 py-1 bg-[#FF385C]/10 text-[#FF385C] rounded-full text-sm font-medium">
                                    {filters.amenities.length} amenities
                                </span>
                            )}
                            {(filters.pricePerNight?.min || filters.pricePerNight?.max) && (
                                <span className="px-3 py-1 bg-[#FF385C]/10 text-[#FF385C] rounded-full text-sm font-medium">
                                    ${filters.pricePerNight.min || '0'} - ${filters.pricePerNight.max || '1000+'}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Homes Grid */}
                {homes.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🏠</div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                            No homes found
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Try adjusting your filters to see more results
                        </p>
                        <button
                            onClick={handleBackToFilters}
                            className="px-6 py-3 bg-gradient-to-br from-[#FF385C] to-[#E31C5F] text-white font-semibold rounded-lg hover:from-[#E31C5F] hover:to-[#FF385C] transition-all"
                        >
                            Adjust Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {homes.map((home) => (
                            <Card
                                key={home._id}
                                className="group cursor-pointer overflow-hidden border-gray-200 hover:border-[#FF385C] transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                                onClick={() => handleViewDetails(home._id)}
                            >
                                {/* Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={home.images?.[0].url || '/placeholder-home.jpg'}
                                        alt={home.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    {home.featured && (
                                        <span className="absolute top-3 left-3 px-3 py-1 bg-[#FF385C] text-white text-xs font-semibold rounded-full">
                                            Featured
                                        </span>
                                    )}
                                </div>

                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg line-clamp-1">
                                        {home.title}
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-1 text-sm">
                                        <svg
                                            className="w-4 h-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {home.address?.city}, {home.address?.country}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="pb-3">
                                    <div className="space-y-2">
                                        {/* Type and Guests */}
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <span>{home.type || 'Entire place'}</span>
                                            <span>•</span>
                                            <span>{home.guests || 2} guests</span>
                                        </div>

                                        {/* Amenities Preview */}
                                        {home.amenities?.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {home.amenities.slice(0, 3).map((amenity, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
                                                    >
                                                        {amenity.name}
                                                    </span>
                                                ))}
                                                {home.amenities.length > 3 && (
                                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                                                        +{home.amenities.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Rating */}
                                        {home.rating && (
                                            <div className="flex items-center gap-1">
                                                <svg
                                                    className="w-4 h-4 text-[#FF385C]"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {home.rating}
                                                </span>
                                                {home.reviews && (
                                                    <span className="text-sm text-gray-500">
                                                        ({home.reviews})
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>

                                <CardFooter className="pt-3 border-t">
                                    <div className="flex items-baseline gap-1 w-full">
                                        <span className="text-2xl font-semibold text-gray-900">
                                            ${home.pricePerNight}
                                        </span>
                                        <span className="text-sm text-gray-500">/ night</span>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}

                {/* pagination */}
                {homes.length > 0 && homes.length >= 12 && (
                    <div className="mt-12 text-center">
                        <button className="px-8 py-3 border-2 border-gray-900 text-gray-900 font-semibold rounded-lg hover:bg-gray-900 hover:text-white transition-all">
                            Load More
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecommendedHomes;