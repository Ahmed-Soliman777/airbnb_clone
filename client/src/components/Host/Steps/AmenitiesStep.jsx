import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAmenities } from "@/store/Slices/amenitySlice";
import { Wifi } from "lucide-react";
import { Card } from "@/components/ui/card";

const AmenitiesStep = ({ data, onUpdate }) => {
  const dispatch = useDispatch();
  const { amenities, status } = useSelector((state) => state.amenity);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAmenities());
    }
  }, [status, dispatch]);
  const toggleAmenity = (amenityId) => {
    const currentAmenities = data.amenities || [];
    const newAmenities = currentAmenities.includes(amenityId)
      ? currentAmenities.filter((id) => id !== amenityId)
      : [...currentAmenities, amenityId];
    onUpdate({ amenities: newAmenities });
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-muted-foreground">Loading amenities...</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-destructive">Failed to load amenities</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Wifi className="w-10 h-10 text-accent-foreground" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          What amenities do you offer?
        </h2>
        <p className="text-muted-foreground text-lg">
          Select all amenities that apply to your property
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {amenities.map((amenity) => {
            const isSelected = data.amenities?.includes(amenity._id);

            return (
              <Card
                key={amenity._id}
                onClick={() => toggleAmenity(amenity._id)}
                className={`p-5 cursor-pointer transition-[var(--transition-smooth)] hover:scale-[1.02] hover:shadow-[var(--shadow-hover)] ${
                  isSelected
                    ? "border-2 border-primary bg-accent/50 shadow-md"
                    : "border-2 border-border hover:border-primary/30"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                    isSelected ? "bg-primary/10" : "bg-muted"
                  }`}>
                    {amenity.icon ? (
                      <div
                        className={`w-6 h-6 transition-colors ${
                          isSelected ? "text-primary" : "text-muted-foreground"
                        }`}
                        dangerouslySetInnerHTML={{ __html: amenity.icon }}
                      />
                    ) : (
                      <Wifi
                        className={`w-6 h-6 transition-colors ${
                          isSelected ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span
                      className={`font-semibold text-sm block transition-colors ${
                        isSelected ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {amenity.name}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {data.amenities && data.amenities.length > 0 && (
          <div className="mt-8 p-6 bg-gradient-to-br from-accent to-accent/50 rounded-xl border border-primary/20 shadow-sm">
            <div className="flex items-center justify-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  {data.amenities.length}
                </span>
              </div>
              <p className="text-foreground font-semibold text-lg">
                {data.amenities.length === 1 ? "amenity" : "amenities"} selected
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AmenitiesStep;
