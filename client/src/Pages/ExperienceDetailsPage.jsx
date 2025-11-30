import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getExperienceById,
  clearCurrentExperience,
} from "@/store/Slices/experienceSlice";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Star,
  Clock,
  Users,
  MapPin,
  Share,
  Heart,
  Shield,
  Check,
  Calendar,
} from "lucide-react";

const ExperienceDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { experience, status } = useSelector((state) => state.experience);

  useEffect(() => {
    dispatch(getExperienceById(id));
    return () => {
      dispatch(clearCurrentExperience());
    };
  }, [dispatch, id]);

  if (status === "loading" || !experience) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="aspect-video rounded-xl mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-96 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const {
    title,
    description,
    images,
    city,
    country,
    street,
    pricePerPerson,
    duration,
    groupSize,
    experienceType,
    ageRequirement,
    fitnessLevel,
    requirements,
    inclusions,
    schedule,
    rating = 4.9,
    reviewCount = 0,
  } = experience;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/experiences"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Share className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Heart className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Image Gallery */}
      <section className="container max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-4 gap-2 rounded-xl overflow-hidden">
          {images && images.length > 0 ? (
            <>
              <div className="col-span-4 md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto">
                <img
                  src={images[0]?.url}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
              {images.slice(1, 5).map((img, index) => (
                <div key={index} className="hidden md:block aspect-[4/3]">
                  <img
                    src={img.url}
                    alt={`${title} ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </>
          ) : (
            <div className="col-span-4 aspect-[16/9] bg-muted rounded-xl flex items-center justify-center">
              <p className="text-muted-foreground">No images available</p>
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <main className="container max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title Section */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">
                  {experienceType || "Experience"}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-foreground text-foreground" />
                  <span className="font-medium">{rating}</span>
                  {reviewCount > 0 && (
                    <span className="text-muted-foreground">
                      ({reviewCount} reviews)
                    </span>
                  )}
                </div>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {title}
              </h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {[street, city, country].filter(Boolean).join(", ")}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-6 py-6 border-y">
              {duration && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{duration}</p>
                    <p className="text-sm text-muted-foreground">Duration</p>
                  </div>
                </div>
              )}
              {groupSize && (
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {groupSize.min}-{groupSize.max} guests
                    </p>
                    <p className="text-sm text-muted-foreground">Group size</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                About this experience
              </h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {description || "No description provided."}
              </p>
            </div>

            {/* What's Included */}
            {inclusions && inclusions.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  What's included
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {inclusions.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {(ageRequirement ||
              fitnessLevel ||
              (requirements && requirements.length > 0)) && (
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Guest requirements
                </h2>
                <div className="space-y-3">
                  {ageRequirement && (
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-muted-foreground" />
                      <span>Age: {ageRequirement}</span>
                    </div>
                  )}
                  {fitnessLevel && (
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-muted-foreground" />
                      <span>Fitness level: {fitnessLevel}</span>
                    </div>
                  )}
                  {requirements &&
                    requirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-muted-foreground" />
                        <span>{req}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Schedule */}
            {schedule && schedule.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Available dates
                </h2>
                <div className="flex flex-wrap gap-2">
                  {schedule.map((slot, index) => (
                    <Badge key={index} variant="outline" className="py-2 px-3">
                      <Calendar className="w-4 h-4 mr-2" />
                      {slot.day || slot} {slot.time && `at ${slot.time}`}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card border rounded-xl p-6 shadow-lg">
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-2xl font-bold">${pricePerPerson}</span>
                <span className="text-muted-foreground">/ person</span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="border rounded-lg p-3">
                  <label className="text-xs font-medium text-muted-foreground">
                    DATE
                  </label>
                  <p className="font-medium">Select a date</p>
                </div>
                <div className="border rounded-lg p-3">
                  <label className="text-xs font-medium text-muted-foreground">
                    GUESTS
                  </label>
                  <p className="font-medium">1 guest</p>
                </div>
              </div>

              <Button className="w-full mb-4" size="lg">
                Reserve
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                You won't be charged yet
              </p>

              <div className="border-t mt-6 pt-6">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">
                    ${pricePerPerson} x 1 guest
                  </span>
                  <span>${pricePerPerson}</span>
                </div>
                <div className="flex justify-between font-semibold pt-4 border-t">
                  <span>Total</span>
                  <span>${pricePerPerson}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExperienceDetailsPage;
