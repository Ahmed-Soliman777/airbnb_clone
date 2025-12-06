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
        ? ["Adventure", "Culture", "Food & Drink", "Sports", "Wellness", "Art", "Nature"]
        : ["Cleaning", "Plumbing", "Electrical", "Gardening", "Moving", "Repair", "Installation"];

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
                <Button variant="outline" className="gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    {hasActiveFilters && (
                        <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                            {selectedCategories.length + (priceRange[0] !== 0 || priceRange[1] !== 1000 ? 1 : 0) + (minRating > 0 ? 1 : 0)}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="flex items-center justify-between">
                        Filters
                        {hasActiveFilters && (
                            <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2">
                                <X className="w-4 h-4" />
                                Clear all
                            </Button>
                        )}
                    </SheetTitle>
                </SheetHeader>

                <div className="space-y-6 mt-6">
                    {/* Price Range */}
                    <div className="space-y-4">
                        <Label className="text-base font-semibold">Price Range</Label>
                        <div className="space-y-4">
                            <Slider
                                value={priceRange}
                                onValueChange={setPriceRange}
                                min={0}
                                max={1000}
                                step={10}
                                className="w-full"
                            />
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>${priceRange[0]}</span>
                                <span>${priceRange[1]}</span>
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="space-y-4">
                        <Label className="text-base font-semibold">Categories</Label>
                        <div className="space-y-3">
                            {categories.map((category) => (
                                <div key={category} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={category}
                                        checked={selectedCategories.includes(category)}
                                        onCheckedChange={() => handleCategoryToggle(category)}
                                    />
                                    <label
                                        htmlFor={category}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                        {category}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Minimum Rating */}
                    <div className="space-y-4">
                        <Label className="text-base font-semibold">Minimum Rating</Label>
                        <div className="flex gap-2">
                            {[0, 3, 4, 4.5].map((rating) => (
                                <Button
                                    key={rating}
                                    variant={minRating === rating ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setMinRating(rating)}
                                    className="flex-1"
                                >
                                    {rating === 0 ? "Any" : `${rating}+`}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Apply Button */}
                    <Button onClick={handleApply} className="w-full" size="lg">
                        Show Results
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default SearchFilters;
