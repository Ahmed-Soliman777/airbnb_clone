import { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { searchExperiences, clearSearchResults } from "@/store/Slices/experienceSlice";
import ExperienceCard from "@/components/cards/ExperienceCard";
import SearchFilters from "@/components/filters/SearchFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const ExperienceSearchPage = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const [filters, setFilters] = useState({
        priceRange: [0, 1000],
        categories: [],
        minRating: 0
    });

    const {
        searchResults,
        searchStatus,
        searchTotal,
        searchTotalPages,
        searchCurrentPage
    } = useSelector((state) => state.experience);

    const city = searchParams.get('city') || '';
    const date = searchParams.get('date') || '';
    const guests = searchParams.get('guests') || '';

    // Initial search
    useEffect(() => {
        dispatch(clearSearchResults());
        dispatch(searchExperiences({
            city,
            date,
            guests,
            page: 1,
            limit: 10,
            ...filters
        }));

        return () => {
            dispatch(clearSearchResults());
        };
    }, [dispatch, city, date, guests, filters]);

    const handleApplyFilters = (newFilters) => {
        setFilters(newFilters);
    };

    // Load more handler
    const handleLoadMore = useCallback(() => {
        if (searchCurrentPage < searchTotalPages) {
            dispatch(searchExperiences({
                city,
                date,
                guests,
                page: searchCurrentPage + 1,
                limit: 10,
                ...filters
            }));
        }
    }, [dispatch, city, date, guests, searchCurrentPage, searchTotalPages, filters]);

    const hasMore = searchCurrentPage < searchTotalPages;
    const isLoading = searchStatus === "loading";
    const isInitialLoading = isLoading && searchResults.length === 0;

    // Skeleton loader
    const renderSkeletons = (count = 10) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(count)].map((_, i) => (
                <div key={i} className="space-y-3">
                    <Skeleton className="aspect-[4/3] rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-1/4" />
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background border-b">
                <div className="container max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Link
                            to="/experiences"
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-medium">Back</span>
                        </Link>

                        <div className="flex-1 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Search className="w-4 h-4" />
                                <span>
                                    {city && `${city}`}
                                    {date && ` · ${new Date(date).toLocaleDateString()}`}
                                    {guests && ` · ${guests}`}
                                    {!city && !date && !guests && 'All experiences'}
                                </span>
                            </div>
                            <SearchFilters onApplyFilters={handleApplyFilters} type="experience" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Results */}
            <main className="container max-w-7xl mx-auto px-4 py-8">
                {/* Results count */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-foreground">
                        {isInitialLoading ? (
                            <Skeleton className="h-8 w-48" />
                        ) : (
                            `${searchTotal} experience${searchTotal !== 1 ? 's' : ''} found`
                        )}
                    </h1>
                    {city && (
                        <p className="text-muted-foreground mt-1">
                            in {city}
                        </p>
                    )}
                </div>

                {/* Initial loading state */}
                {isInitialLoading && renderSkeletons(10)}

                {/* Results grid */}
                {!isInitialLoading && searchResults.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {searchResults.map((experience) => (
                                <ExperienceCard key={experience._id} experience={experience} />
                            ))}
                        </div>

                        {/* Load more button */}
                        {hasMore && (
                            <div className="mt-8 flex justify-center">
                                <Button
                                    onClick={handleLoadMore}
                                    disabled={isLoading}
                                    variant="outline"
                                    size="lg"
                                    className="min-w-[200px]"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></span>
                                            Loading...
                                        </span>
                                    ) : (
                                        `Load more (${searchResults.length} of ${searchTotal})`
                                    )}
                                </Button>
                            </div>
                        )}
                    </>
                )}

                {/* Empty state */}
                {!isInitialLoading && searchResults.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                            <Search className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h2 className="text-xl font-semibold text-foreground mb-2">
                            No experiences found
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            Try adjusting your search criteria or browse all experiences
                        </p>
                        <Link to="/experiences">
                            <Button>Browse all experiences</Button>
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ExperienceSearchPage;