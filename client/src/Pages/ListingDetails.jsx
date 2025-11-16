import { Card } from "@/components/ui/card";
import { Info, MapPin, Users } from "lucide-react";
import ListingGallery from "@/components/Listing/ListingGallery";
import GuestFavouriteIcon from "@/components/Listing/GuestFavouriteIcon";

const bedrooms = [
  {
    id: 1,
    title: "Bedroom 1",
    subtitle: "1 bunk bed",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 2,
    title: "Bedroom 2",
    subtitle: "1 bunk bed",
    img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80",
  },
];

const ListingDetails = () => {
  return (
    <>
      <ListingGallery />
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/*============= Left Side ================== */}
        <div className="md:col-span-2 space-y-6">
          {/* Title & Info */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Entire guest house in Toacaso, Ecuador
            </h2>
            <p className="text-gray-600">
              5 guests · 2 bedrooms · 4 beds · 1 bathroom
            </p>
          </div>

          {/* ============== Highlights ================ */}
          <div className="flex items-center justify-between gap-4 border rounded-lg p-4">
            <div className="flex items-center gap-3 ">
              <div className="flex items-center justify-center gap-5">
                <GuestFavouriteIcon side="left" />
                <div className="text-center font-semibold text-gray-800 w-16 text-lg flex flex-col items-center">
                  <span className="m-0">Guest</span>
                  <span className="m-0">favourite</span>
                </div>
                <GuestFavouriteIcon side="right" />
              </div>

              <div>
                One of the most loved homes on Airbnb, according to guests
              </div>
            </div>

            {/* ----------- rating -------------  */}
            <div className="text-center ">
              <p className="font-semibold text-gray-800 text-sm">4.9 ★</p>
            </div>
            {/*---------- vertical line ------- */}
            <div className="h-9 border-l border-gray-300"></div>
            {/* ----------- Reviews -------------  */}
            <div className=" text-center">
              <p className="font-semibold text-gray-800 text-sm">195 </p>
              <p>Reviews</p>
            </div>
          </div>

          {/* Host info */}
          <div className="flex items-center gap-4">
            <img
              src="https://randomuser.me/api/portraits/women/55.jpg"
              alt="Host"
              className="w-12 h-12 rounded-full border"
            />
            <div>
              <p className="font-semibold">Hosted by Jo</p>
              <p className="text-sm text-gray-500">
                Superhost · 8 years hosting
              </p>
            </div>
          </div>

          <hr />

          {/* Amenities */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Info className="text-gray-700 mt-1" />
              <div>
                <p className="font-semibold">Outdoor entertainment</p>
                <p className="text-sm text-gray-600">
                  The firepit, alfresco dining, BBQ area and outdoor seating are
                  great for summer trips.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="text-gray-700 mt-1" />
              <div>
                <p className="font-semibold">Mountain and garden views</p>
                <p className="text-sm text-gray-600">
                  Soak up the views during your stay.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="text-gray-700 mt-1" />
              <div>
                <p className="font-semibold">Park for free</p>
                <p className="text-sm text-gray-600">
                  This is one of the few places in the area with free parking.
                </p>
              </div>
            </div>
          </div>

          <hr />

          {/* Description */}
          <div className="text-gray-700 leading-relaxed space-y-3">
            <p>
              Special discounts long stays. Quinta Los Duendes. We offer a 2
              bed, 1 bath, detached house, totally private and independent with
              green areas, fully equipped kitchenette, filtered water, free tea
              and coffee, Super fast internet 60mbps sleeps 1–5 people, with
              parking.
            </p>
            <p>
              Close to Cotopaxi NP, Quilotoa, El Boliche and Saquisili. An ideal
              place to use as a base for those who wish to climb the volcanoes.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Where you'll sleep */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Where you'll sleep</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bedrooms.map((b) => (
              <Card key={b.id} className="shadow-sm rounded-lg overflow-hidden">
                <div className="flex gap-4 p-4 items-start">
                  <div className="w-40 h-28 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                    {/* If you have a shadcn Image component, use it; otherwise plain img */}
                    <img
                      src={b.img}
                      alt={b.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{b.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{b.subtitle}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <hr />

        {/* What this place offers */}
        <section>
          <h3 className="text-xl font-semibold mb-6">What this place offers</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Left column (amenities list) */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3"></div>
            </div>

            {/* Right column (more amenities) */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3"></div>
            </div>
          </div>
        </section>

        <hr />

        {/* Select checkout date */}
        <section>
          <h3 className="text-xl font-semibold mb-6">What this place offers</h3>
        </section>
      </div>
    </>
  );
};

export default ListingDetails;
