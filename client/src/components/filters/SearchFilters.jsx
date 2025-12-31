import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal, X } from "lucide-react";

const SearchFilters = ({ onApplyFilters, type = "experience" }) => {
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [minRating, setMinRating] = useState(0);

    const categories = type === "experience"
        ? ["adventure", "cultural", "food", "sports", "wellness", "art", "nature"]
        : ["home-services", "repairs", "cleaning", "professional", "tutoring", "beauty", "event", "tech"];

    const handleCategoryToggle = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const handleApply = () => {
        onApplyFilters({
            priceRange,
            categories: selectedCategories,
            minRating
        });
    };

    const handleReset = () => {
        setPriceRange([0, 1000]);
        setSelectedCategories([]);
        setMinRating(0);
        onApplyFilters({
            priceRange: [0, 1000],
            categories: [],
            minRating: 0
        });
    };

    const hasActiveFilters =
        priceRange[0] !== 0 ||
        priceRange[1] !== 1000 ||
        selectedCategories.length > 0 ||
        minRating > 0;

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    className="gap-2 rounded-full border-neutral-300 bg-white hover:bg-neutral-50 transition-all duration-200 hover:shadow-sm"
                >
                    <SlidersHorizontal className="w-4 h-4 text-neutral-700" />
                    Filters
                    {hasActiveFilters && (
                        <span className="ml-1 px-1.5 py-0.5 text-xs font-semibold bg-rose-500 text-white rounded-full animate-scale-in">
                            {selectedCategories.length +
                                (priceRange[0] !== 0 || priceRange[1] !== 1000 ? 1 : 0) +
                                (minRating > 0 ? 1 : 0)}
                        </span>
                    )}
                </Button>
            </SheetTrigger>

            <SheetContent className="w-full sm:max-w-md overflow-y-auto px-6 py-6 bg-white">
                <SheetHeader>
                    <SheetTitle className="flex items-center justify-between text-lg font-semibold tracking-tight">
                        Filters
                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleReset}
                                className="gap-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Clear all
                            </Button>
                        )}
                    </SheetTitle>
                </SheetHeader>

                <div className="space-y-8 mt-8">
                    {/* Price Range */}
                    <div className="space-y-4">
                        <Label className="text-base font-semibold text-neutral-900">
                            Price Range
                        </Label>
                        <div className="space-y-4">
                            <Slider
                                value={priceRange}
                                onValueChange={setPriceRange}
                                min={0}
                                max={1000}
                                step={10}
                                className="w-full accent-rose-500"
                            />
                            <div className="flex items-center justify-between text-sm text-neutral-500">
                                <span>${priceRange[0]}</span>
                                <span>${priceRange[1]}</span>
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="space-y-4">
                        <Label className="text-base font-semibold text-neutral-900">
                            Categories
                        </Label>
                        <div className="space-y-3">
                            {categories.map((category) => (
                                <div
                                    key={category}
                                    className="flex items-center space-x-3 rounded-lg px-2 py-1.5 hover:bg-neutral-50 transition-colors"
                                >
                                    <Checkbox
                                        id={category}
                                        checked={selectedCategories.includes(category)}
                                        onCheckedChange={() => handleCategoryToggle(category)}
                                        className="data-[state=checked]:bg-rose-500 data-[state=checked]:border-rose-500"
                                    />
                                    <label
                                        htmlFor={category}
                                        className="text-sm font-medium text-neutral-700 cursor-pointer"
                                    >
                                        {category}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Minimum Rating */}
                    {/* <div className="space-y-4">
                        <Label className="text-base font-semibold text-neutral-900">
                            Minimum Rating
                        </Label>
                        <div className="flex gap-2">
                            {[0, 3, 4, 4.5].map((rating) => (
                                <Button
                                    key={rating}
                                    variant={minRating === rating ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setMinRating(rating)}
                                    className={`flex-1 rounded-full transition-all duration-200 ${minRating === rating
                                        ? "bg-rose-500 text-white hover:bg-rose-600 shadow-sm"
                                        : "border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50"
                                        }`}
                                >
                                    {rating === 0 ? "Any" : `${rating}+`}
                                </Button>
                            ))}
                        </div>
                    </div> */}

                    {/* Apply Button */}
                    <Button
                        onClick={handleApply}
                        className="w-full rounded-xl bg-rose-500 text-white hover:bg-rose-600 transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
                        size="lg"
                    >
                        Show Results
                    </Button>
                </div>
            </SheetContent>
        </Sheet>

    );
};

export default SearchFilters;
