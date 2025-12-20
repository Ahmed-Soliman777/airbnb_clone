import ServiceCard from "@/components/cards/ServiceCard";
import CityCarouselSection from "@/components/sections/CityCarouselSection";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllServices } from "@/store/Slices/serviceSlice";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ServicesPage = () => {
  const dispatch = useDispatch();
  const { services, status } = useSelector((state) => state.service);

  useEffect(() => {
    dispatch(getAllServices());
  }, [dispatch]);

  // Group services by city
  const servicesByCity = useMemo(() => {
    const list = Array.isArray(services) ? services : [];
    if (list.length === 0) return {};
    
    return list.reduce((acc, svc) => {
      const city = svc.city || "Other";
      if (!acc[city]) {
        acc[city] = [];
      }
      acc[city].push(svc);
      return acc;
    }, {});
  }, [services]);

  const cities = Object.keys(servicesByCity);

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
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="bg-gradient-to-b from-accent to-background py-12">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Find Local Services
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional services from trusted providers. Book the help you need.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="container max-w-7xl mx-auto px-4 py-8">
        {cities.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No services available yet.</p>
            <Link 
              to="/" 
              className="text-primary hover:underline mt-2 inline-block"
            >
              List your first service
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {cities.map((city) => (
              <CityCarouselSection
                key={city}
                title={`Activities in ${city}`}
                subtitle={`${servicesByCity[city].length} services available`}
                items={servicesByCity[city]}
                renderCard={(service) => (
                  <ServiceCard service={service} />
                )}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ServicesPage;