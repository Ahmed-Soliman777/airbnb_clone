import { Button } from "@/components/ui/button";
import { Grip, Heart, Share } from "lucide-react";

const AirbnbGallery = () => {
  return (
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
            src="https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1000&q=80"
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
  );
};

export default AirbnbGallery;
