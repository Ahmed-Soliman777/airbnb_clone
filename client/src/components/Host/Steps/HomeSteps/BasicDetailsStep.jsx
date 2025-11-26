import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText } from "lucide-react";

const propertyTypes = [
    { value: "apartment", label: "Apartment" },
    { value: "house", label: "House" },
    { value: "villa", label: "Villa" },
    { value: "condo", label: "Condo" },
    { value: "townhouse", label: "Townhouse" },
    { value: "cottage", label: "Cottage" },
];

export default function BasicDetailsStep({ data, onUpdate }) {
    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-accent-foreground" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                    Let's start with the basics
                </h2>
                <p className="text-muted-foreground">
                    Tell guests what makes your place special
                </p>
            </div>

            <div className="space-y-4 max-w-xl mx-auto">
                <div>
                    <Label htmlFor="title">Property Title</Label>
                    <Input
                        id="title"
                        placeholder="Cozy apartment in the heart of the city"
                        value={data.title || ""}
                        onChange={(e) => onUpdate({ title: e.target.value })}
                        className="mt-1.5"
                    />
                </div>

                <div>
                    <Label htmlFor="propertyType">Property Type</Label>
                    <Select
                        value={data.propertyType || ""}
                        onValueChange={(value) => onUpdate({ propertyType: value })}
                    >
                        <SelectTrigger id="propertyType" className="mt-1.5">
                            <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                        <SelectContent>
                            {propertyTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        placeholder="Describe your property, its unique features, and what guests can expect..."
                        value={data.description || ""}
                        onChange={(e) => onUpdate({ description: e.target.value })}
                        className="mt-1.5 min-h-[150px]"
                    />
                    <p className="text-sm text-muted-foreground mt-1.5">
                        {data.description?.length || 0} characters
                    </p>
                </div>

                {data.title && data.propertyType && data.description && (
                    <div className="p-4 bg-muted rounded-lg mt-6">
                        <h3 className="font-semibold text-foreground mb-2">Preview</h3>
                        <p className="text-sm text-foreground font-medium">{data.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">{data.propertyType}</p>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                            {data.description}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
