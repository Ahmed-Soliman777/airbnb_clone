import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";

const ServiceCard = ({ service }) => {
    const {
        _id,
        title,
        images,
        city,
        hourlyRate,
        rating = 4.8,
        reviewCount = 0,
        serviceCategory,
    } = service;

    const mainImage = images?.[0].url || "/placeholder.svg";

    return (
        <Link to={`/services/${_id}`} className="group block">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3">
                <img
                    src={mainImage}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                    <span className="bg-background/90 backdrop-blur-sm text-foreground text-xs font-medium px-2.5 py-1 rounded-full">
                        {serviceCategory || "Service"}
                    </span>
                </div>
            </div>

            <div className="space-y-1">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground truncate pr-2">{title}</h3>
                    <div className="flex items-center gap-1 shrink-0">
                        <Star className="w-4 h-4 fill-foreground text-foreground" />
                        <span className="text-sm font-medium">{rating}</span>
                        {reviewCount > 0 && (
                            <span className="text-sm text-muted-foreground">({reviewCount})</span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{city}</span>
                </div>

                <p className="text-foreground">
                    <span className="font-semibold">${hourlyRate}</span>
                    <span className="text-muted-foreground"> / hour</span>
                </p>
            </div>
        </Link>
    );
};

export default ServiceCard;
