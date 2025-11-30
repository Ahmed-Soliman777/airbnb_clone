import { Link } from "react-router-dom";
import { Star, Clock, Users } from "lucide-react";

const ExperienceCard = ({ experience }) => {
    const {
        _id,
        title,
        images,
        city,
        pricePerPerson,
        duration,
        rating = 4.9,
        reviewCount = 0,
        experienceType,
    } = experience;

    const mainImage = images?.[0]?.url || "/placeholder.svg";
    const altText = images?.[0]?.alt || title;

    return (
        <Link to={`/experiences/${_id}`} className="group block">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3">
                <img
                    src={mainImage}
                    alt={altText}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                    <span className="bg-background/90 backdrop-blur-sm text-foreground text-xs font-medium px-2.5 py-1 rounded-full">
                        {experienceType || "Experience"}
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

                <p className="text-muted-foreground text-sm">{city}</p>

                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    {duration && (
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{duration}</span>
                        </div>
                    )}
                </div>

                <p className="text-foreground">
                    <span className="font-semibold">${pricePerPerson}</span>
                    <span className="text-muted-foreground"> / person</span>
                </p>
            </div>
        </Link>
    );
};

export default ExperienceCard;
