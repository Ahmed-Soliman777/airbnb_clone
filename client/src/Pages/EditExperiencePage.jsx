import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getExperienceById, updateExperience } from "@/store/Slices/experienceSlice";
import { toast } from "sonner";
import { ArrowLeft, Compass, MapPin, DollarSign, Users, Clock, Calendar, CheckCircle, Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const experienceTypes = [
    "Adventure",
    "Art & Culture",
    "Entertainment",
    "Food & Drink",
    "Nature & Outdoors",
    "Sports",
    "Tours",
    "Wellness",
];

const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

export default function EditExperiencePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { experience, status } = useSelector((state) => state.experience);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        experienceType: "",
        street: "",
        city: "",
        country: "",
        coordinates: { lat: 0, lng: 0 },
        pricePerPerson: 0,
        duration: "",
        groupSize: { min: 1, max: 10 },
        schedule: [],
        ageRequirement: "",
        fitnessLevel: "",
        requirements: [],
        inclusions: [],
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newRequirement, setNewRequirement] = useState("");
    const [newInclusion, setNewInclusion] = useState("");
    const [newSchedule, setNewSchedule] = useState({ day: "", time: "" });

    useEffect(() => {
        if (id) {
            dispatch(getExperienceById(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (experience && experience._id === id) {
            setFormData({
                title: experience.title || "",
                description: experience.description || "",
                experienceType: experience.experienceType || "",
                street: experience.street || "",
                city: experience.city || "",
                country: experience.country || "",
                coordinates: experience.coordinates || { lat: 0, lng: 0 },
                pricePerPerson: experience.pricePerPerson || 0,
                duration: experience.duration || "",
                groupSize: experience.groupSize || { min: 1, max: 10 },
                schedule: experience.schedule || [],
                ageRequirement: experience.ageRequirement || "",
                fitnessLevel: experience.fitnessLevel || "",
                requirements: experience.requirements || [],
                inclusions: experience.inclusions || [],
            });
        }
    }, [experience, id]);

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleCoordinateChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            coordinates: {
                ...prev.coordinates,
                [field]: parseFloat(value) || 0,
            },
        }));
    };

    const handleGroupSizeChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            groupSize: {
                ...prev.groupSize,
                [field]: parseInt(value) || 1,
            },
        }));
    };

    const addRequirement = () => {
        if (newRequirement.trim()) {
            setFormData((prev) => ({
                ...prev,
                requirements: [...prev.requirements, newRequirement.trim()],
            }));
            setNewRequirement("");
        }
    };

    const removeRequirement = (index) => {
        setFormData((prev) => ({
            ...prev,
            requirements: prev.requirements.filter((_, i) => i !== index),
        }));
    };

    const addInclusion = () => {
        if (newInclusion.trim()) {
            setFormData((prev) => ({
                ...prev,
                inclusions: [...prev.inclusions, newInclusion.trim()],
            }));
            setNewInclusion("");
        }
    };

    const removeInclusion = (index) => {
        setFormData((prev) => ({
            ...prev,
            inclusions: prev.inclusions.filter((_, i) => i !== index),
        }));
    };

    const addSchedule = () => {
        if (newSchedule.day && newSchedule.time) {
            setFormData((prev) => ({
                ...prev,
                schedule: [...prev.schedule, { ...newSchedule }],
            }));
            setNewSchedule({ day: "", time: "" });
        }
    };

    const removeSchedule = (index) => {
        setFormData((prev) => ({
            ...prev,
            schedule: prev.schedule.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await dispatch(updateExperience({ id, data: formData })).unwrap();
            toast.success("Experience updated successfully!");
            navigate("/host/dashboard");
        } catch (error) {
            toast.error(error?.message || "Failed to update experience");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background border-b border-border">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(-1)}
                        className="gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                    <h1 className="text-lg font-semibold">Edit Experience</h1>
                    <div className="w-20" />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 py-8 space-y-8">
                {/* Basic Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Compass className="h-5 w-5" />
                            Basic Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleChange("title", e.target.value)}
                                placeholder="Name your experience"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="experienceType">Experience Type</Label>
                            <Select
                                value={formData.experienceType}
                                onValueChange={(value) => handleChange("experienceType", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select experience type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {experienceTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                                placeholder="Describe your experience"
                                rows={4}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Location */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Location
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="street">Street Address</Label>
                            <Input
                                id="street"
                                value={formData.street}
                                onChange={(e) => handleChange("street", e.target.value)}
                                placeholder="Meeting point address"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    value={formData.city}
                                    onChange={(e) => handleChange("city", e.target.value)}
                                    placeholder="City"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input
                                    id="country"
                                    value={formData.country}
                                    onChange={(e) => handleChange("country", e.target.value)}
                                    placeholder="Country"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="lat">Latitude</Label>
                                <Input
                                    id="lat"
                                    type="number"
                                    step="any"
                                    value={formData.coordinates.lat}
                                    onChange={(e) => handleCoordinateChange("lat", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lng">Longitude</Label>
                                <Input
                                    id="lng"
                                    type="number"
                                    step="any"
                                    value={formData.coordinates.lng}
                                    onChange={(e) => handleCoordinateChange("lng", e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Duration & Group Size */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Duration & Group Size
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="duration">Duration</Label>
                            <Input
                                id="duration"
                                value={formData.duration}
                                onChange={(e) => handleChange("duration", e.target.value)}
                                placeholder="e.g., 2 hours, Half day"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="minGroup">Minimum Group Size</Label>
                                <Input
                                    id="minGroup"
                                    type="number"
                                    min="1"
                                    value={formData.groupSize.min}
                                    onChange={(e) => handleGroupSizeChange("min", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="maxGroup">Maximum Group Size</Label>
                                <Input
                                    id="maxGroup"
                                    type="number"
                                    min="1"
                                    value={formData.groupSize.max}
                                    onChange={(e) => handleGroupSizeChange("max", e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Schedule */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Schedule
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Select
                                value={newSchedule.day}
                                onValueChange={(value) => setNewSchedule({ ...newSchedule, day: value })}
                            >
                                <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Select day" />
                                </SelectTrigger>
                                <SelectContent>
                                    {daysOfWeek.map((day) => (
                                        <SelectItem key={day} value={day}>
                                            {day}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Input
                                type="time"
                                value={newSchedule.time}
                                onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                                className="flex-1"
                            />
                            <Button type="button" onClick={addSchedule} size="icon">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {formData.schedule.map((slot, index) => (
                                <Badge key={index} variant="secondary" className="gap-1">
                                    {slot.day} at {slot.time}
                                    <X
                                        className="h-3 w-3 cursor-pointer"
                                        onClick={() => removeSchedule(index)}
                                    />
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Requirements */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5" />
                            Requirements & Inclusions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="ageRequirement">Age Requirement</Label>
                                <Input
                                    id="ageRequirement"
                                    value={formData.ageRequirement}
                                    onChange={(e) => handleChange("ageRequirement", e.target.value)}
                                    placeholder="e.g., 18+"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fitnessLevel">Fitness Level</Label>
                                <Select
                                    value={formData.fitnessLevel}
                                    onValueChange={(value) => handleChange("fitnessLevel", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Easy">Easy</SelectItem>
                                        <SelectItem value="Moderate">Moderate</SelectItem>
                                        <SelectItem value="Challenging">Challenging</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                            <Label>Guest Requirements</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={newRequirement}
                                    onChange={(e) => setNewRequirement(e.target.value)}
                                    placeholder="Add a requirement"
                                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
                                />
                                <Button type="button" onClick={addRequirement} size="icon">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.requirements.map((req, index) => (
                                    <Badge key={index} variant="outline" className="gap-1">
                                        {req}
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => removeRequirement(index)}
                                        />
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                            <Label>What's Included</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={newInclusion}
                                    onChange={(e) => setNewInclusion(e.target.value)}
                                    placeholder="Add an inclusion"
                                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addInclusion())}
                                />
                                <Button type="button" onClick={addInclusion} size="icon">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.inclusions.map((inc, index) => (
                                    <Badge key={index} variant="secondary" className="gap-1">
                                        {inc}
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => removeInclusion(index)}
                                        />
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Pricing */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            Pricing
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="pricePerPerson">Price per Person ($)</Label>
                            <Input
                                id="pricePerPerson"
                                type="number"
                                min="0"
                                value={formData.pricePerPerson}
                                onChange={(e) => handleChange("pricePerPerson", parseFloat(e.target.value) || 0)}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Separator />

                {/* Submit Button */}
                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
