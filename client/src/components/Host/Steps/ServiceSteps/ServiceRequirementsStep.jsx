import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Award, Plus, X } from "lucide-react";

export default function ServiceRequirementsStep({ data, onUpdate }) {
  const [newRequirement, setNewRequirement] = useState("");
  const [newSkill, setNewSkill] = useState("");

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

  const addSkill = () => {
    if (newSkill.trim()) {
      onUpdate({
        skills: [...(data.skills || []), newSkill],
      });
      setNewSkill("");
    }
  };

  const removeSkill = (index) => {
    const updatedSkills = data.skills.filter((_, i) => i !== index);
    onUpdate({ skills: updatedSkills });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
          <Award className="w-8 h-8 text-accent-foreground" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Skills & Requirements
        </h2>
        <p className="text-muted-foreground">
          Share your expertise and any client requirements
        </p>
      </div>

      <div className="space-y-8 max-w-xl mx-auto">
        <div>
          <Label htmlFor="skill" className="mb-3 block">Your Skills & Certifications</Label>
          <div className="flex gap-2">
            <Input
              id="skill"
              placeholder="e.g., Certified Professional Cleaner"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addSkill()}
            />
            <Button type="button" onClick={addSkill} size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {data.skills && data.skills.length > 0 && (
            <div className="space-y-2 mt-4">
              {data.skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Award className="w-4 h-4 text-primary flex-shrink-0" />
                    <p className="text-sm text-foreground">{skill}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSkill(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-border pt-6">
          <Label htmlFor="requirement" className="mb-3 block">Client Requirements</Label>
          <div className="flex gap-2">
            <Input
              id="requirement"
              placeholder="e.g., Must have parking available"
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addRequirement()}
            />
            <Button type="button" onClick={addRequirement} size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {data.requirements && data.requirements.length > 0 && (
            <div className="space-y-2 mt-4">
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
          )}
        </div>

        {((data.skills && data.skills.length > 0) || (data.requirements && data.requirements.length > 0)) && (
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-foreground mb-2">Summary</h3>
            <div className="space-y-1 text-sm">
              {data.skills && data.skills.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Skills listed:</span>
                  <span className="text-foreground font-medium">{data.skills.length}</span>
                </div>
              )}
              {data.requirements && data.requirements.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Requirements:</span>
                  <span className="text-foreground font-medium">{data.requirements.length}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
