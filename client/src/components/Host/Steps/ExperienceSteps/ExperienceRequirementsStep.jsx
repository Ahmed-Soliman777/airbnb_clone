import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Plus, X } from "lucide-react";

export default function ExperienceRequirementsStep({ data, onUpdate }) {
    const [newRequirement, setNewRequirement] = useState("");

    const addRequirement = () => {
        if (newRequirement.trim()) {
            onUpdate({
                requirements: [...(data.requirements || []), newRequirement],
            });
            setNewRequirement("");
        }
    };

    const removeRequirement = (index) => {
        const updatedRequirements = data.requirements.filter((_, i) => i !== index);
        onUpdate({ requirements: updatedRequirements });
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-accent-foreground" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                    Guest requirements
                </h2>
                <p className="text-muted-foreground">
                    Set age limits, fitness levels, and other requirements
                </p>
            </div>

            <div className="space-y-6 max-w-xl mx-auto">
                <div>
                    <Label htmlFor="ageRequirement">Minimum Age</Label>
                    <Select
                        value={data.ageRequirement || ""}
                        onValueChange={(value) => onUpdate({ ageRequirement: value })}
                    >
                        <SelectTrigger id="ageRequirement" className="mt-1.5">
                            <SelectValue placeholder="Select minimum age" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-ages">All ages welcome</SelectItem>
                            <SelectItem value="5+">5 years and up</SelectItem>
                            <SelectItem value="10+">10 years and up</SelectItem>
                            <SelectItem value="13+">13 years and up</SelectItem>
                            <SelectItem value="16+">16 years and up</SelectItem>
                            <SelectItem value="18+">18 years and up (adults only)</SelectItem>
                            <SelectItem value="21+">21 years and up</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="fitnessLevel">Required Fitness Level</Label>
                    <Select
                        value={data.fitnessLevel || ""}
                        onValueChange={(value) => onUpdate({ fitnessLevel: value })}
                    >
                        <SelectTrigger id="fitnessLevel" className="mt-1.5">
                            <SelectValue placeholder="Select fitness level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="easy">Easy - No fitness required</SelectItem>
                            <SelectItem value="moderate">Moderate - Basic fitness needed</SelectItem>
                            <SelectItem value="challenging">Challenging - Good fitness required</SelectItem>
                            <SelectItem value="extreme">Extreme - Excellent fitness required</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="requirement">Additional Requirements</Label>
                    <div className="flex gap-2 mt-1.5">
                        <Input
                            id="requirement"
                            placeholder="e.g., Must know how to swim"
                            value={newRequirement}
                            onChange={(e) => setNewRequirement(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && addRequirement()}
                        />
                        <Button type="button" onClick={addRequirement} size="icon">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {data.requirements && data.requirements.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="font-semibold text-foreground text-sm">Requirements List</h3>
                        <div className="space-y-2">
                            {data.requirements.map((req, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                                >
                                    <p className="text-sm text-foreground">{req}</p>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeRequirement(index)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {data.ageRequirement && data.fitnessLevel && (
                    <div className="p-4 bg-muted rounded-lg mt-6">
                        <h3 className="font-semibold text-foreground mb-2">Requirements Summary</h3>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Age requirement:</span>
                                <span className="text-foreground capitalize">{data.ageRequirement}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Fitness level:</span>
                                <span className="text-foreground capitalize">{data.fitnessLevel}</span>
                            </div>
                            {data.requirements && data.requirements.length > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Additional requirements:</span>
                                    <span className="text-foreground">{data.requirements.length}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
