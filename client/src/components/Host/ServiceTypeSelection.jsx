import { Home, Compass, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";

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

  return (
    <div className="container max-w-6xl mx-auto px-4 py-12 md:py-20">
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
