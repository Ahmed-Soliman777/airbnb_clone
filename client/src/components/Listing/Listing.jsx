import { Button } from "@/components/ui/button";
import { Grip, Heart, Info, MapPin, Share, Star, Users } from "lucide-react";

const AirbnbGallery = () => {
  return (
    <>
      <div className="max-w-6xl mx-auto mt-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-semibold text-gray-900">
            Guest house with views of the Cotopaxi Volcano
          </h1>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            >
              <Share size={18} />
              <div className="underline">Share</div>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            >
              <Heart size={18} />
              <div className="underline">Save</div>
            </Button>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-5 grid-rows-2 gap-2 rounded-xl overflow-hidden">
          {/* Large main image */}
          <div className="col-span-3 row-span-2">
            <img
              src="https://a0.muscache.com/im/pictures/2de40031-8635-424e-9a59-ebd18da1a8a6.jpg?im_w=960"
              alt="Cotopaxi Volcano view"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Top right images */}
          <img
            src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80"
            alt="Kitchen view"
            className="w-full h-full object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1595526114035-0e65c3f7b6b6?auto=format&fit=crop&w=600&q=80"
            alt="Dining area"
            className="w-full h-full object-cover"
          />

          {/* Bottom right images */}
          <img
            src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80"
            alt="Another kitchen view"
            className="w-full h-full object-cover"
          />
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
              alt="Bedroom view"
              className="w-full h-full object-cover"
            />
            <button className="absolute bottom-3 right-3 w-39 bg-white/90 text-gray-900 text-sm font-medium rounded-md px-3 py-1 shadow-sm hover:bg-white transition flex items-center gap-2">
              <Grip size={16} />
              Show all photos
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Side */}
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

          {/* Highlights */}
          <div className="flex flex-wrap items-center gap-4 border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Star className="text-pink-600" size={20} />
              <div>
                <div className="width: auto; height: 32px;">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 32"
                    fill="none"
                    height="32"
                  >
                    <g clip-path="url(#clip0_5880_37786)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M4.06516 25.417L4.72713 24.4547L3.02437 23.6492L2.3624 24.6116L3.21378 25.0143L2.3624 24.6116C0.890857 26.751 1.60381 29.3868 3.95483 30.4989C4.69986 30.8513 5.55423 31.0196 6.43257 30.987L6.75025 30.9752L6.82494 29.2305L6.50726 29.2423C5.98026 29.2618 5.46764 29.1608 5.02062 28.9494C3.61001 28.2821 3.18223 26.7007 4.06516 25.417Z"
                        fill="#222222"
                      ></path>
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M11.2303 10.235C9.47283 8.96204 8.62998 7.4878 8.70171 5.81232C8.77344 4.13685 9.7454 2.59524 11.6176 1.18749C13.375 2.46049 14.2179 3.93473 14.1462 5.6102C14.0744 7.28568 13.1025 8.82729 11.2303 10.235Z"
                        fill="#F7F7F7"
                      ></path>
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M12.3604 0.489275C11.9975 0.226387 11.4472 0.246818 11.0605 0.537533C9.01618 2.07473 7.84763 3.84975 7.76242 5.84026C7.6772 7.83076 8.69724 9.52453 10.6163 10.9146C10.9792 11.1775 11.5296 11.157 11.9162 10.8663C13.9605 9.32914 15.1291 7.55411 15.2143 5.56361C15.2995 3.57311 14.2795 1.87933 12.3604 0.489275ZM11.6311 2.3684C12.7748 3.38355 13.2568 4.47199 13.2069 5.63813C13.157 6.80428 12.5801 7.93203 11.3456 9.03547C10.2019 8.02032 9.71991 6.93187 9.76983 5.76573C9.81975 4.59959 10.3966 3.47184 11.6311 2.3684Z"
                        fill="#222222"
                      ></path>
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M3.87411 24.0529C5.42328 22.353 7.12208 21.4688 8.97051 21.4001C10.8189 21.3315 12.4473 22.0923 13.8556 23.6824C12.3065 25.3823 10.6077 26.2666 8.75924 26.3352C6.9108 26.4038 5.28243 25.6431 3.87411 24.0529Z"
                        fill="#F7F7F7"
                      ></path>
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M14.6494 24.1787C14.9466 23.8526 14.9656 23.4097 14.6954 23.1046C13.1648 21.3765 11.2793 20.4331 9.03368 20.5164C6.78805 20.5998 4.81561 21.6864 3.13199 23.5339C2.83478 23.86 2.81582 24.303 3.08601 24.608C4.61655 26.3361 6.50208 27.2795 8.74771 27.1962C10.9933 27.1128 12.9658 26.0262 14.6494 24.1787ZM12.5669 23.7198C11.3316 24.8808 10.0869 25.4045 8.82241 25.4515C7.55791 25.4984 6.35415 25.0656 5.21452 23.9928C6.44977 22.8318 7.69449 22.3081 8.95899 22.2611C10.2235 22.2142 11.4272 22.6471 12.5669 23.7198Z"
                        fill="#222222"
                      ></path>
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M8.87809 20.7043C9.34099 18.5957 10.3908 17.0928 12.0274 16.1956C13.6641 15.2984 15.5603 15.1864 17.716 15.8596C17.2531 17.9683 16.2033 19.4712 14.5667 20.3684C12.93 21.2656 11.0338 21.3775 8.87809 20.7043Z"
                        fill="#F7F7F7"
                      ></path>
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M18.7627 15.9443C18.8516 15.5393 18.6104 15.1569 18.1814 15.023C15.821 14.2859 13.5833 14.3695 11.6022 15.4554C9.6302 16.5364 8.45336 18.3139 7.95247 20.5956C7.86356 21.0006 8.10482 21.3829 8.5338 21.5169C10.8942 22.254 13.1319 22.1704 15.113 21.0844C17.085 20.0034 18.2618 18.226 18.7627 15.9443ZM16.6012 16.4656C16.1209 17.9951 15.2748 19.007 14.1415 19.6282C13.0241 20.2407 11.7105 20.4286 10.114 20.0743C10.5943 18.5448 11.4404 17.5329 12.5737 16.9116C13.6911 16.2991 15.0047 16.1113 16.6012 16.4656Z"
                        fill="#222222"
                      ></path>
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M11.6456 15.6267C10.8982 13.6743 11.0176 11.9555 12.004 10.4702C12.9903 8.98484 14.6462 8.03014 16.9718 7.60605C17.7192 9.55846 17.5997 11.2773 16.6134 12.7626C15.6271 14.2479 13.9711 15.2026 11.6456 15.6267Z"
                        fill="#F7F7F7"
                      ></path>
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M17.8943 7.28295C17.7454 6.89397 17.2889 6.67525 16.8087 6.76282C14.2562 7.22831 12.291 8.31371 11.1107 10.0911C9.93513 11.8614 9.84602 13.854 10.6566 15.9715C10.8055 16.3605 11.262 16.5792 11.7422 16.4916C14.2947 16.0261 16.26 14.9407 17.4402 13.1634C18.6158 11.393 18.7049 9.40048 17.8943 7.28295ZM16.2162 8.6613C16.6143 10.1267 16.4088 11.3465 15.7201 12.3835C15.0407 13.4067 13.9538 14.1584 12.3348 14.5931C11.9366 13.1278 12.1421 11.9079 12.8308 10.8709C13.5102 9.84774 14.5972 9.09607 16.2162 8.6613Z"
                        fill="#222222"
                      ></path>
                    </g>
                    <defs>
                      <clipPath id="clip0_5880_37786">
                        <rect
                          width="18.8235"
                          height="32"
                          fill="white"
                          transform="matrix(-1 0 0 1 19.1016 0.000488281)"
                        ></rect>
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <p className="font-semibold text-gray-800">Guest favourite</p>
                <p className="text-sm text-gray-500">
                  One of the most loved homes on Airbnb
                </p>
              </div>
            </div>
            <div className="ml-auto text-right">
              <p className="font-semibold text-gray-800 text-lg">4.9 ★</p>
              <p className="text-sm text-gray-500">195 reviews</p>
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
    </>
  );
};

export default AirbnbGallery;
