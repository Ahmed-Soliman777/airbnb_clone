import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getServiceById, updateService } from "@/store/Slices/serviceSlice";
import { toast } from "sonner";
import { ArrowLeft, Briefcase, MapPin, DollarSign, Clock, Package, CheckCircle, Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const serviceCategories = [
    "Photography",
    "Videography",
    "Catering",
    "Music & Entertainment",
    "Event Planning",
    "Cleaning",
    "Personal Training",
    "Tutoring",
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

export default function EditServicePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { service, status } = useSelector((state) => state.service);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        serviceCategory: "",
        serviceArea: "",
        city: "",
        country: "",
        coordinates: { lat: 0, lng: 0 },
        hourlyRate: 0,
        packages: [],
        availability: [],
        requirements: [],
        skills: [],
        serviceDetails: {
            responseTime: "",
            cancellationPolicy: "",
            additionalInfo: "",
        },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newSkill, setNewSkill] = useState("");
    const [newRequirement, setNewRequirement] = useState("");
    const [newPackage, setNewPackage] = useState({ name: "", price: "", description: "" });
    const [newAvailability, setNewAvailability] = useState({ day: "", startTime: "", endTime: "" });

    useEffect(() => {
        if (id) {
            dispatch(getServiceById(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (service && service._id === id) {
            setFormData({
                title: service.title || "",
                description: service.description || "",
                serviceCategory: service.serviceCategory || "",
                serviceArea: service.serviceArea || "",
                city: service.city || "",
                country: service.country || "",
                coordinates: service.coordinates || { lat: 0, lng: 0 },
                hourlyRate: service.hourlyRate || 0,
                packages: service.packages || [],
                availability: service.availability || [],
                requirements: service.requirements || [],
                skills: service.skills || [],
                serviceDetails: service.serviceDetails || {
                    responseTime: "",
                    cancellationPolicy: "",
                    additionalInfo: "",
                },
            });
        }
    }, [service, id]);

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

    const handleServiceDetailsChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            serviceDetails: {
                ...prev.serviceDetails,
                [field]: value,
            },
        }));
    };

    const addSkill = () => {
        if (newSkill.trim()) {
            setFormData((prev) => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()],
            }));
            setNewSkill("");
        }
    };

    const removeSkill = (index) => {
        setFormData((prev) => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index),
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

    const addPackage = () => {
        if (newPackage.name && newPackage.price) {
            setFormData((prev) => ({
                ...prev,
                packages: [...prev.packages, { ...newPackage, price: parseFloat(newPackage.price) }],
            }));
            setNewPackage({ name: "", price: "", description: "" });
        }
    };

    const removePackage = (index) => {
        setFormData((prev) => ({
            ...prev,
            packages: prev.packages.filter((_, i) => i !== index),
        }));
    };

    const addAvailability = () => {
        if (newAvailability.day && newAvailability.startTime && newAvailability.endTime) {
            setFormData((prev) => ({
                ...prev,
                availability: [...prev.availability, { ...newAvailability }],
            }));
            setNewAvailability({ day: "", startTime: "", endTime: "" });
        }
    };

    const removeAvailability = (index) => {
        setFormData((prev) => ({
            ...prev,
            availability: prev.availability.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await dispatch(updateService({ id, data: formData })).unwrap();
            toast.success("Service updated successfully!");
            navigate("/host/dashboard");
        } catch (error) {
            toast.error(error?.message || "Failed to update service");
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
                    <h1 className="text-lg font-semibold">Edit Service</h1>
                    <div className="w-20" />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 py-8 space-y-8">
                {/* Basic Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Briefcase className="h-5 w-5" />
                            Basic Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Service Name</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleChange("title", e.target.value)}
                                placeholder="Name your service"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="serviceCategory">Category</Label>
                            <Select
                                value={formData.serviceCategory}
                                onValueChange={(value) => handleChange("serviceCategory", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {serviceCategories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
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
                                placeholder="Describe your service"
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
                            Service Area
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="serviceArea">Service Area Description</Label>
                            <Textarea
                                id="serviceArea"
                                value={formData.serviceArea}
                                onChange={(e) => handleChange("serviceArea", e.target.value)}
                                placeholder="Describe the areas you serve"
                                rows={2}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city">Primary City</Label>
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
                                <Label htmlFor="lat">Latitude (optional)</Label>
                                <Input
                                    id="lat"
                                    type="number"
                                    step="any"
                                    value={formData.coordinates.lat}
                                    onChange={(e) => handleCoordinateChange("lat", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lng">Longitude (optional)</Label>
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

                {/* Skills */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5" />
                            Skills & Requirements
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <Label>Your Skills</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    placeholder="Add a skill"
                                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                                />
                                <Button type="button" onClick={addSkill} size="icon">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.skills.map((skill, index) => (
                                    <Badge key={index} variant="secondary" className="gap-1">
                                        {skill}
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => removeSkill(index)}
                                        />
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                            <Label>Client Requirements</Label>
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
                    </CardContent>
                </Card>

                {/* Availability */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Availability
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2 flex-wrap">
                            <Select
                                value={newAvailability.day}
                                onValueChange={(value) => setNewAvailability({ ...newAvailability, day: value })}
                            >
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Day" />
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
                                value={newAvailability.startTime}
                                onChange={(e) => setNewAvailability({ ...newAvailability, startTime: e.target.value })}
                                className="w-[130px]"
                                placeholder="Start"
                            />
                            <Input
                                type="time"
                                value={newAvailability.endTime}
                                onChange={(e) => setNewAvailability({ ...newAvailability, endTime: e.target.value })}
                                className="w-[130px]"
                                placeholder="End"
                            />
                            <Button type="button" onClick={addAvailability} size="icon">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {formData.availability.map((slot, index) => (
                                <Badge key={index} variant="secondary" className="gap-1">
                                    {slot.day}: {slot.startTime} - {slot.endTime}
                                    <X
                                        className="h-3 w-3 cursor-pointer"
                                        onClick={() => removeAvailability(index)}
                                    />
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Packages */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Service Packages
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <Input
                                value={newPackage.name}
                                onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                                placeholder="Package name"
                            />
                            <Input
                                type="number"
                                value={newPackage.price}
                                onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
                                placeholder="Price ($)"
                            />
                            <div className="flex gap-2">
                                <Input
                                    value={newPackage.description}
                                    onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                                    placeholder="Description"
                                />
                                <Button type="button" onClick={addPackage} size="icon">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {formData.packages.map((pkg, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium">{pkg.name}</p>
                                        <p className="text-sm text-muted-foreground">{pkg.description}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">${pkg.price}</span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removePackage(index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Pricing & Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            Pricing & Service Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                            <Input
                                id="hourlyRate"
                                type="number"
                                min="0"
                                value={formData.hourlyRate}
                                onChange={(e) => handleChange("hourlyRate", parseFloat(e.target.value) || 0)}
                            />
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <Label htmlFor="responseTime">Response Time</Label>
                            <Input
                                id="responseTime"
                                value={formData.serviceDetails.responseTime}
                                onChange={(e) => handleServiceDetailsChange("responseTime", e.target.value)}
                                placeholder="e.g., Within 24 hours"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
                            <Textarea
                                id="cancellationPolicy"
                                value={formData.serviceDetails.cancellationPolicy}
                                onChange={(e) => handleServiceDetailsChange("cancellationPolicy", e.target.value)}
                                placeholder="Describe your cancellation policy"
                                rows={2}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="additionalInfo">Additional Information</Label>
                            <Textarea
                                id="additionalInfo"
                                value={formData.serviceDetails.additionalInfo}
                                onChange={(e) => handleServiceDetailsChange("additionalInfo", e.target.value)}
                                placeholder="Any other details clients should know"
                                rows={2}
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
