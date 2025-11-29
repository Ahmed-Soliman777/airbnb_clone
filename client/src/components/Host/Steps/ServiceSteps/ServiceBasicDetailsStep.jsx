import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase } from "lucide-react";

const serviceCategories = [
  { value: "home-services", label: "Home Services" },
  { value: "repairs", label: "Repairs & Maintenance" },
  { value: "cleaning", label: "Cleaning Services" },
  { value: "professional", label: "Professional Services" },
  { value: "tutoring", label: "Tutoring & Education" },
  { value: "beauty", label: "Beauty & Wellness" },
  { value: "event", label: "Event Services" },
  { value: "tech", label: "Tech Support" },
];

export default function ServiceBasicDetailsStep({ data, onUpdate }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-8 h-8 text-accent-foreground" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Tell us about your service
        </h2>
        <p className="text-muted-foreground">
          Help clients understand what you offer
        </p>
      </div>

      <div className="space-y-4 max-w-xl mx-auto">
        <div>
          <Label htmlFor="title">Service Name</Label>
          <Input
            id="title"
            placeholder="Professional home cleaning service"
            value={data.title || ""}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="serviceCategory">Service Category</Label>
          <Select
            value={data.serviceCategory || ""}
            onValueChange={(value) => onUpdate({ serviceCategory: value })}
          >
            <SelectTrigger id="serviceCategory" className="mt-1.5">
              <SelectValue placeholder="Select service category" />
            </SelectTrigger>
            <SelectContent>
              {serviceCategories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Service Description</Label>
          <Textarea
            id="description"
            placeholder="Describe your service, what's included, your expertise, and what makes you stand out..."
            value={data.description || ""}
            onChange={(e) => onUpdate({ description: e.target.value })}
            className="mt-1.5 min-h-[150px]"
          />
          <p className="text-sm text-muted-foreground mt-1.5">
            {data.description?.length || 0} characters
          </p>
        </div>

        {data.title && data.serviceCategory && data.description && (
          <div className="p-4 bg-muted rounded-lg mt-6">
            <h3 className="font-semibold text-foreground mb-2">Preview</h3>
            <p className="text-sm text-foreground font-medium">{data.title}</p>
            <p className="text-xs text-muted-foreground">
              {serviceCategories.find(c => c.value === data.serviceCategory)?.label}
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
