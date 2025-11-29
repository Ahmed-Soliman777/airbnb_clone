import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Plus, X } from "lucide-react";

export default function ExperienceInclusionsStep({ data, onUpdate }) {
    const [newInclusion, setNewInclusion] = useState("");

    const addInclusion = () => {
        if (newInclusion.trim()) {
            onUpdate({
                inclusions: [...(data.inclusions || []), newInclusion],
            });
            setNewInclusion("");
        }
    };

    const removeInclusion = (index) => {
        const updatedInclusions = data.inclusions.filter((_, i) => i !== index);
        onUpdate({ inclusions: updatedInclusions });
    };

    const commonInclusions = [
        "Equipment rental",
        "Professional guide",
        "Snacks and drinks",
        "Transportation",
        "Safety equipment",
        "Photos and videos",
        "Entrance fees",
        "Insurance coverage",
    ];

    const quickAdd = (inclusion) => {
        if (!data.inclusions?.includes(inclusion)) {
            onUpdate({
                inclusions: [...(data.inclusions || []), inclusion],
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-accent-foreground" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                    What's included?
                </h2>
                <p className="text-muted-foreground">
                    Let guests know what they'll get with this experience
                </p>
            </div>

            <div className="space-y-6 max-w-xl mx-auto">
                <div>
                    <Label htmlFor="inclusion">Add What's Included</Label>
                    <div className="flex gap-2 mt-1.5">
                        <Input
                            id="inclusion"
                            placeholder="e.g., All equipment and safety gear"
                            value={newInclusion}
                            onChange={(e) => setNewInclusion(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && addInclusion()}
                        />
                        <Button type="button" onClick={addInclusion} size="icon">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div>
                    <Label className="mb-3 block">Quick Add (Common Inclusions)</Label>
                    <div className="flex flex-wrap gap-2">
                        {commonInclusions.map((inclusion) => (
                            <Button
                                key={inclusion}
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => quickAdd(inclusion)}
                                disabled={data.inclusions?.includes(inclusion)}
                            >
                                <Plus className="w-3 h-3 mr-1" />
                                {inclusion}
                            </Button>
                        ))}
                    </div>
                </div>

                {data.inclusions && data.inclusions.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="font-semibold text-foreground">What's Included</h3>
                        <div className="space-y-2">
                            {data.inclusions.map((inclusion, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-muted rounded-lg group hover:bg-muted/80 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                                        <p className="text-sm text-foreground">{inclusion}</p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeInclusion(index)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {(!data.inclusions || data.inclusions.length === 0) && (
                    <div className="text-center p-8 border-2 border-dashed border-border rounded-lg">
                        <CheckCircle2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">
                            No inclusions added yet. Add what's included in your experience.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
