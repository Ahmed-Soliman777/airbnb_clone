import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

const homes = [
  {
    id: 1,
    title: "Flat in Zamalek",
    date: "9–11 Jan",
    price: "€142 for 2 nights",
    rating: "★ 5.0",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Apartment in Garden City",
    date: "21–23 Nov",
    price: "€89 for 2 nights",
    rating: "★ 4.94",
    image:
      "https://images.unsplash.com/photo-1595526114035-0b9c2f7a8f29?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Studio in Heliopolis",
    date: "6–8 Feb",
    price: "€65 for 2 nights",
    rating: "★ 4.97",
    image:
      "https://images.unsplash.com/photo-1600607687489-06a9a96b6c28?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "Room in Maadi",
    date: "12–14 Dec",
    price: "€38 for 2 nights",
    rating: "★ 4.98",
    image:
      "https://images.unsplash.com/photo-1600585154526-990dced4df89?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    title: "Nile view apartment",
    date: "17–19 Apr",
    price: "€210 for 2 nights",
    rating: "★ 4.99",
    image:
      "https://images.unsplash.com/photo-1600585154154-0c8e054e27aa?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    title: "Loft in Downtown Cairo",
    date: "28–30 Nov",
    price: "€98 for 2 nights",
    rating: "★ 4.99",
    image:
      "https://images.unsplash.com/photo-1600585153837-ffb0f5d4e4b0?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 7,
    title: "Flat in 6th of October",
    date: "12–14 Dec",
    price: "€77 for 2 nights",
    rating: "★ 4.96",
    image:
      "https://images.unsplash.com/photo-1600585153826-8d8b8c1e6f0c?auto=format&fit=crop&w=800&q=80",
  },
];

export default function PopularHomesCarousel() {
  return (
    <section className="w-11/12 py-10 relative mx-auto">
      {/*--------------- Header ------------------- */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Popular homes in Cairo</h2>
      </div>

      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full relative"
      >
        {/* Arrows */}
        <div className="absolute -top-14 right-0 flex gap-2">
          <CarouselPrevious className="relative static translate-y-0 border rounded-full w-9 h-9 flex items-center justify-center shadow-sm hover:bg-gray-100" />
          <CarouselNext className="relative static translate-y-0 border rounded-full w-9 h-9 flex items-center justify-center shadow-sm hover:bg-gray-100" />
        </div>

        {/* Cards */}
        <CarouselContent className="-ml-2 md:-ml-4">
          {homes.map((home) => (
            <CarouselItem
              key={home.id}
              className="pl-2 md:pl-4 basis-[16.66%] max-w-[16.66%] shrink-0"
            >
              <Card className="overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="relative">
                  <img
                    src={home.image}
                    alt={home.title}
                    className="h-36 w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <button className="absolute top-2 right-2 bg-white/80 rounded-full p-1">
                    <Heart className="w-4 h-4 text-gray-700" />
                  </button>
                  <div className="absolute top-2 left-2 bg-white text-xs font-medium px-2 py-1 rounded-full">
                    Guest favourite
                  </div>
                </div>

                <CardContent className="p-3">
                  <h3 className="font-medium text-sm">{home.title}</h3>
                  <p className="text-xs text-gray-500">{home.date}</p>
                  <p className="text-sm mt-1">
                    {home.price}{" "}
                    <span className="text-gray-500">{home.rating}</span>
                  </p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
