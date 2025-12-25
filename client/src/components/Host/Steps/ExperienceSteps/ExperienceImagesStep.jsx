import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import {
  addExperienceImage,
  removeExperienceImage,
} from "@/store/Slices/experienceFormSlice";

export default function ExperienceImagesStep({ data, onUpdate }) {
  const dispatch = useDispatch();
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

  // Compress image helper
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to JPEG with 0.7 quality
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const newFile = new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });
                resolve(newFile);
              } else {
                resolve(file); // Fallback to original file
              }
            },
            "image/jpeg",
            0.7
          );
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const processFiles = async (files) => {
    const fileArray = Array.from(files);

    // Process only images
    const imageFiles = fileArray.filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length > 0) {
      // Compress all images in parallel
      const compressedImages = await Promise.all(
        imageFiles.map((file) => compressImage(file))
      );

      onUpdate({ images: [...(data.images || []), ...compressedImages] });
      dispatch(addExperienceImage(compressedImages));
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFiles(e.target.files);
    }
  };

  const removeImage = (index) => {
    const updatedImages = data.images.filter((_, i) => i !== index);
    onUpdate({ images: updatedImages });
    dispatch(removeExperienceImage(index));
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
          <ImageIcon className="w-8 h-8 text-accent-foreground" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Show off your experience
        </h2>
        <p className="text-muted-foreground">
          Add photos that capture the essence of your experience
        </p>
      </div>

      <div className="max-w-xl mx-auto">
        <Label className="mb-3 block">Experience Photos</Label>

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
            Upload up to 10 high-quality photos (JPG, PNG)
          </p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="experience-file-upload"
          />
          <label htmlFor="experience-file-upload">
            <Button type="button" variant="outline" asChild>
              <span>Choose Files</span>
            </Button>
          </label>
        </div>

        {data.images && data.images.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-foreground mb-3">
              Uploaded Images ({data.images.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.images.map((image, index) => (
                <div
                  key={index}
                  className="relative group aspect-square bg-muted rounded-lg overflow-hidden"
                >
                  <img
                    src={
                      image instanceof File ? URL.createObjectURL(image) : image
                    }
                    alt={`Experience ${index + 1}`}
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
              No images uploaded yet. Add photos to showcase your experience.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
