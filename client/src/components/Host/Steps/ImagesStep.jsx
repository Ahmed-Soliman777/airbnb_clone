import { useRef, useState } from "react";
import { Image, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ImagesStep({ data, onUpdate }) {

    const fileInputRef = useRef(null);
    const [previewUrls, setPreviewUrls] = useState([]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const newImages = [...(data.images || []), ...files];
            onUpdate({ images: newImages });

            const newPreviews = files.map((file) => URL.createObjectURL(file));
            setPreviewUrls((prev) => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index) => {
        const newImages = [...(data.images || [])];
        newImages.splice(index, 1);
        onUpdate({ images: newImages });

        URL.revokeObjectURL(previewUrls[index]);
        const newPreviews = [...previewUrls];
        newPreviews.splice(index, 1);
        setPreviewUrls(newPreviews);
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
                    <Image className="w-8 h-8 text-accent-foreground" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                    Add photos of your place
                </h2>
                <p className="text-muted-foreground">
                    Great photos help guests imagine staying at your place
                </p>
            </div>

            <div className="max-w-3xl mx-auto">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                />

                {previewUrls.length === 0 ? (
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-64 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-4 hover:border-primary hover:bg-accent/50 transition-all duration-300 cursor-pointer"
                    >
                        <Upload className="w-12 h-12 text-muted-foreground" />
                        <div>
                            <p className="text-foreground font-medium mb-1">
                                Upload your photos
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Drag and drop or click to browse
                            </p>
                        </div>
                    </button>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {previewUrls.map((url, index) => (
                                <div key={index} className="relative group aspect-square">
                                    <img
                                        src={url}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                    <button
                                        onClick={() => removeImage(index)}
                                        className="absolute top-2 right-2 w-8 h-8 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    {index === 0 && (
                                        <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                                            Cover photo
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full"
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Add more photos
                        </Button>
                    </div>
                )}

                <p className="text-sm text-muted-foreground mt-4 text-center">
                    Upload at least 5 photos. The first photo will be your cover photo.
                </p>
            </div>
        </div>
    );
};
