import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";

export default function ServiceImagesStep({ data, onUpdate }) {
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        console.log("Files dropped:", e.dataTransfer.files);
    };

    const handleFileSelect = (e) => {
        console.log("Files selected:", e.target.files);
    };

    const removeImage = (index) => {
        const updatedImages = data.images.filter((_, i) => i !== index);
        onUpdate({ images: updatedImages });
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
                    <ImageIcon className="w-8 h-8 text-accent-foreground" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                    Showcase your work
                </h2>
                <p className="text-muted-foreground">
                    Add photos of your previous projects and work
                </p>
            </div>

            <div className="max-w-xl mx-auto">
                <Label className="mb-3 block">Portfolio Photos</Label>

                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                            ? "border-primary bg-accent"
                            : "border-border hover:border-primary/50"
                        }`}
                >
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-foreground font-medium mb-2">
                        Drop your images here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                        Show examples of your work (JPG, PNG)
                    </p>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                    />
                    <label htmlFor="file-upload">
                        <Button type="button" variant="outline" asChild>
                            <span>Choose Files</span>
                        </Button>
                    </label>
                </div>

                {data.images && data.images.length > 0 && (
                    <div className="mt-6">
                        <h3 className="font-semibold text-foreground mb-3">
                            Portfolio Images ({data.images.length})
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {data.images.map((image, index) => (
                                <div
                                    key={index}
                                    className="relative group aspect-square bg-muted rounded-lg overflow-hidden"
                                >
                                    <img
                                        src={image}
                                        alt={`Portfolio ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => removeImage(index)}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {(!data.images || data.images.length === 0) && (
                    <div className="text-center p-8 border border-border rounded-lg mt-6">
                        <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">
                            No images uploaded yet. Showcase your best work.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
