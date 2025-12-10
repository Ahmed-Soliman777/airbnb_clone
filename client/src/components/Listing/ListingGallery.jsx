import { Button } from "@/components/ui/button";
import { Grip, Heart, Share } from "lucide-react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlistItem } from "@/store/Slices/wishlistSlice";
import { useState } from "react";
import ShareModal from "./ShareModal";
import PhotoGalleryModal from "./PhotoGalleryModal";

const ListingGallery = ({ title, images = [], description }) => {
  // Get listing ID from URL params
  const { id } = useParams();
  const dispatch = useDispatch();
  // Get wishlist items from Redux store
  const wishlistItems = useSelector((state) => state.wishlist.items);

  // Local state for modals
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPhotoGalleryOpen, setIsPhotoGalleryOpen] = useState(false);

  const listingUrl = window.location.href;

  const isFav = wishlistItems.includes(id);
  const urls = images
    .map((img) => (typeof img === "string" ? img : img?.url))
    .filter(Boolean);
  const [img1, img2, img3, img4, img5] = [
    urls[0] || "https://placehold.co/1200x800?text=Photo+1",
    urls[1] || "https://placehold.co/600x400?text=Photo+2",
    urls[2] || "https://placehold.co/600x400?text=Photo+3",
    urls[3] || "https://placehold.co/600x400?text=Photo+4",
    urls[4] || "https://placehold.co/600x400?text=Photo+5",
  ];
  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-semibold text-gray-900">
          {title || "Listing"}
        </h1>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            onClick={() => setIsShareModalOpen(true)}
          >
            <Share size={18} />
            <div className="underline">Share</div>
          </Button>
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            onClick={() => dispatch(toggleWishlistItem(id))}
          >
            <Heart
              size={20}
              fill={isFav ? "red" : "none"}
              strokeWidth={isFav ? 0 : 2}
            />
            <div className="underline">Save</div>
          </Button>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        listingTitle={title || "Listing"}
        listingUrl={listingUrl}
        listingImage={urls[0]}
        listingDescription={description}
      />

      {/* Photo Gallery Modal */}
      <PhotoGalleryModal
        isOpen={isPhotoGalleryOpen}
        onClose={() => setIsPhotoGalleryOpen(false)}
        images={images}
        title={title || "Listing"}
      />

      {/* Gallery */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-xl overflow-hidden h-[420px]">
        {/* Large main image */}
        <div className="col-span-2 row-span-2">
          <img
            src={img1}
            alt="Main photo"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Top right images */}
        <img src={img2} alt="Photo 2" className="w-full h-full object-cover" />
        <img src={img3} alt="Photo 3" className="w-full h-full object-cover" />

        {/* Bottom right images */}
        <img src={img4} alt="Photo 4" className="w-full h-full object-cover" />
        <div className="relative">
          <img
            src={img5}
            alt="Photo 5"
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => setIsPhotoGalleryOpen(true)}
            className="absolute bottom-3 right-3 w-39 bg-white/90 text-gray-900 text-sm font-medium rounded-md px-3 py-1 shadow-sm hover:bg-white transition flex items-center gap-2"
          >
            <Grip size={16} />
            Show all photos
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingGallery;
