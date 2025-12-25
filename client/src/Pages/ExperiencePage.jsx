import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllExperiences } from "@/store/Slices/experienceSlice";
import ExperienceCard from "@/components/cards/ExperienceCard";
import CityCarouselSection from "@/components/sections/CityCarouselSection";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";

const ExperiencesPage = () => {
  const dispatch = useDispatch();
  const { experiences, status } = useSelector((state) => state.experience);

  useEffect(() => {
    dispatch(getAllExperiences());
  }, [dispatch]);

  // Group experiences by city
  const experiencesByCity = useMemo(() => {
    const list = Array.isArray(experiences) ? experiences : [];
    if (list.length === 0) return {};

    return list.reduce((acc, exp) => {
      const city = exp.city || "Other";
      if (!acc[city]) {
        acc[city] = [];
      }
      acc[city].push(exp);
      return acc;
    }, {});
  }, [experiences]);

  const cities = Object.keys(experiencesByCity);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[4/3] rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fefefe]">

      {/* Content */}
      <main className="container max-w-7xl mx-auto px-4 py-8">
        {cities.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No experiences available yet.</p>
            <Link
              to="/experiences"
              className="text-primary hover:underline mt-2 inline-block"
            >
              Create your first experience
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {cities.map((city) => (
              <CityCarouselSection
                key={city}
                title={`Explore ${city}`}
                subtitle={`${experiencesByCity[city].length} experiences in ${city}`}
                items={experiencesByCity[city]}
                renderCard={(experience) => (
                  <ExperienceCard experience={experience} />
                )}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ExperiencesPage;
