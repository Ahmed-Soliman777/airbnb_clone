import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

const CityCarouselSection = ({ title, subtitle, items, renderCard }) => {
    if (!items || items.length === 0) return null;

    return (
        <section className="py-8">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground">{title}</h2>
                {subtitle && (
                    <p className="text-muted-foreground mt-1">{subtitle}</p>
                )}
            </div>

            <Carousel
                opts={{
                    align: "start",
                    loop: items.length > 4,
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-4">
                    {items.map((item, index) => (
                        <CarouselItem key={item._id || index} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                            {renderCard(item)}
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {items.length > 4 && (
                    <>
                        <CarouselPrevious className="hidden md:flex -left-4" />
                        <CarouselNext className="hidden md:flex -right-4" />
                    </>
                )}
            </Carousel>
        </section>
    );
};

export default CityCarouselSection;
