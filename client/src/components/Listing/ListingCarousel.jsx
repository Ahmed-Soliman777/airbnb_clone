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
      "https://images.unsplash.com/photo-1665249934445-1de680641f50?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Apartment in Garden City",
    date: "21–23 Nov",
    price: "€89 for 2 nights",
    rating: "★ 4.94",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Studio in Heliopolis",
    date: "6–8 Feb",
    price: "€65 for 2 nights",
    rating: "★ 4.97",
    image:
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "Room in Maadi",
    date: "12–14 Dec",
    price: "€38 for 2 nights",
    rating: "★ 4.98",
    image:
      "https://images.unsplash.com/photo-1585128792103-0b591f96512e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    title: "Nile view apartment",
    date: "17–19 Apr",
    price: "€210 for 2 nights",
    rating: "★ 4.99",
    image:
      "https://images.unsplash.com/photo-1702014862053-946a122b920d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    title: "Loft in Downtown Cairo",
    date: "28–30 Nov",
    price: "€98 for 2 nights",
    rating: "★ 4.99",
    image:
      "https://images.unsplash.com/photo-1665249934445-1de680641f50?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 7,
    title: "Flat in 6th of October",
    date: "12–14 Dec",
    price: "€77 for 2 nights",
    rating: "★ 4.96",
    image:
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 8,
    title: "Penthouse in Maadi",
    date: "20–22 Jan",
    price: "€250 for 2 nights",
    rating: "★ 5.0",
    image:
      "https://images.unsplash.com/photo-1702014862053-946a122b920d?auto=format&fit=crop&w=800&q=80",
  },
];

export default function PopularHomesCarousel() {
  return (
    <section className="w-10/12 py-10 relative mx-auto">
      {/*--------------- Header for title ------------------- */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Popular homes in Cairo</h2>
      </div>

      {/*--------------- Start of Carousel ------------------- */}

      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full relative"
      >
        {/* ----------------Arrows---------------- */}
        <div className="absolute -top-9 right-0 flex gap-2">
          <CarouselPrevious className="relative static translate-y-0 border rounded-full w-6 h-6 flex items-center justify-center shadow-sm bg-gray-100 hover:scale-110 transition-transform duration-300 disabled:cursor-not-allowed" />
          <CarouselNext className="relative static translate-y-0 border rounded-full w-6 h-6 flex items-center justify-center shadow-sm hover:bg-gray-100" />
        </div>

        <CarouselContent className="-ml-2 md:-ml-4 gap-0">
          {/*---------------- Start of Carousel Item ---------------- */}
          {homes.map((home) => (
            <CarouselItem
              key={home.id}
              className=" basis-1/4 max-w-1/4 lg:basis-[14.285%] lg:max-w-[14.285%] shrink-0"
            >
              {/*---------------- Start of Cards ---------------- */}
              <Card className="overflow-hidden border-0 shadow-none gap-3">
                <div className="relative">
                  <img
                    src={home.image}
                    alt={home.title}
                    className="h-36 w-full object-cover rounded-2xl"
                  />
                  <button className="absolute top-2 right-2 hover:scale-106 transition-transform duration-300">
                    <Heart
                      size={25}
                      className="stroke-gray-100  "
                      fill="rgba(0,0,0,0.45)"
                    />
                  </button>
                  <div className="absolute top-2 left-2 bg-white text-xs font-medium px-2 py-1 rounded-full">
                    Guest favourite
                  </div>
                </div>

                <CardContent className="px-1">
                  <h3 className="font-medium text-[0.8rem]">{home.title}</h3>
                  <p className="text-xs text-gray-500">{home.date}</p>
                  <p className="text-[0.8rem] mt-1">
                    {home.price}
                    <span className="text-gray-500">{home.rating}</span>
                  </p>
                </CardContent>
              </Card>
              {/*---------------- End of Cards ---------------- */}
            </CarouselItem>
          ))}
          {/*---------------- End of Carousel Item ---------------- */}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
