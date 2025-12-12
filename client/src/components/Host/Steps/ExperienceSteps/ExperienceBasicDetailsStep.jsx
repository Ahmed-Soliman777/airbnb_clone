import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles } from "lucide-react";

const experienceTypes = [
  { value: "adventure", label: "Adventure & Outdoors" },
  { value: "cultural", label: "Cultural Experience" },
  { value: "food", label: "Food & Drink" },
  { value: "wellness", label: "Wellness & Fitness" },
  { value: "workshop", label: "Workshop & Class" },
  { value: "entertainment", label: "Entertainment" },
  { value: "nature", label: "Nature & Wildlife" },
  { value: "sports", label: "Sports & Recreation" },
];

export default function ExperienceBasicDetailsStep({ data, onUpdate }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-accent-foreground" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Create an amazing experience
        </h2>
        <p className="text-muted-foreground">
          Share what makes your experience unique and memorable
        </p>
      </div>

      <div className="space-y-4 max-w-xl mx-auto">
        <div>
          <Label htmlFor="title">Experience Title</Label>
          <Input
            id="title"
            placeholder="Sunset kayaking tour with dolphins"
            value={data.title || ""}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="experienceType">Experience Type</Label>
          <Select
            value={data.experienceType || ""}
            onValueChange={(value) => onUpdate({ experienceType: value })}
          >
            <SelectTrigger id="experienceType" className="mt-1.5">
              <SelectValue placeholder="Select experience type" />
            </SelectTrigger>
            <SelectContent>
              {experienceTypes.map((type) => (
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
            placeholder="Describe your experience, what guests will do, and what makes it special..."
            value={data.description || ""}
            onChange={(e) => onUpdate({ description: e.target.value })}
            className="mt-1.5 min-h-[150px]"
          />
          <p className="text-sm text-muted-foreground mt-1.5">
            {data.description?.length || 0} characters
          </p>
        </div>

        {data.title && data.experienceType && data.description && (
          <div className="p-4 bg-muted rounded-lg mt-6">
            <h3 className="font-semibold text-foreground mb-2">Preview</h3>
            <p className="text-sm text-foreground font-medium">{data.title}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {experienceTypes.find(t => t.value === data.experienceType)?.label}
            </p>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
              {data.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
