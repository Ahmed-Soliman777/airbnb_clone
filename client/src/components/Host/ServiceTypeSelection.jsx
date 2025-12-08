import { Home, Compass, Briefcase, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ServiceTypeSelection = ({ onSelect }) => {
  const services = [
    {
      type: "home",
      icon: Home,
      title: "Home",
      description: "List your property for guests to stay",
    },
    {
      type: "experience",
      icon: Compass,
      title: "Experience",
      description: "Host unique activities and tours",
    },
    {
      type: "service",
      icon: Briefcase,
      title: "Service",
      description: "Offer professional services",
    },
  ];

  const browseLinks = [
    {
      to: "/experiences",
      label: "Browse Experiences",
      description: "Discover unique activities hosted by locals",
    },
    {
      to: "/services",
      label: "Browse Services",
      description: "Find professional services near you",
    },
  ];

  return (
    <div className="container max-w-6xl mx-auto px-4 py-12 md:py-20">
      {/* Browse Section */}
      <div className="mb-16">
        <div className="flex flex-wrap gap-4 justify-center">
          {browseLinks.map((link) => (
            <Link key={link.to} to={link.to}>
              <Button variant="outline" size="lg" className="gap-2">
                {link.label}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Host Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          What would you like to host?
        </h1>
        <p className="text-lg text-muted-foreground">
          Choose the type of listing you want to create
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <Card
              key={service.type}
              onClick={() => onSelect(service.type)}
              className="group cursor-pointer p-8 hover:shadow-[var(--shadow-hover)] transition-all duration-300 border-2 hover:border-primary"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                  <Icon className="w-8 h-8 text-accent-foreground group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceTypeSelection;
