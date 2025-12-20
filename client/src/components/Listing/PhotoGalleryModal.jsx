import { ChevronLeft, Heart, Share, X, ChevronRight } from "lucide-react";
import ShareModal from "./ShareModal";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleListing } from "@/store/Slices/wishlistSlice";
import { Button } from "@/components/ui/button";

const PhotoGalleryModal = ({ isOpen, onClose, images = [], title, id }) => {
  const dispatch = useDispatch();
  // Get wishlist items from Redux store
  const savedListings = useSelector((state) => state.wishlist.savedListings);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const isFav = savedListings[id]?.isSaved || false;
  const urls = images
    .map((img) => (typeof img === "string" ? img : img?.url))
    .filter(Boolean);

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const goToNext = () => {
    setLightboxIndex((prev) => (prev + 1) % urls.length);
  };

  const goToPrev = () => {
    setLightboxIndex((prev) => (prev - 1 + urls.length) % urls.length);
  };

  // Keyboard controls for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowRight":
          setLightboxIndex((prev) => (prev + 1) % urls.length);
          break;
        case "ArrowLeft":
          setLightboxIndex((prev) => (prev - 1 + urls.length) % urls.length);
          break;
        case "Escape":
          setLightboxIndex(null);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, urls.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="shrink-0 bg-white border-b shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* back arrow */}
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <ChevronLeft size={16} strokeWidth={1.75} absoluteStrokeWidth />
          </button>
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
              onClick={() => dispatch(toggleListing(id))}
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
      </div>

      {/* Scrollable Grid Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">
          {/* Full Grid - Improved Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {urls.map((url, index) => (
              <div
                key={index}
                onClick={() => openLightbox(index)}
                className="relative w-full aspect-square bg-gray-100 overflow-hidden rounded-xl group shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                <img
                  src={url}
                  alt={`${title} - Photo ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Image number overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 px-3 py-1 rounded-full">
                    {index + 1} / {urls.length}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {urls.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No images available</p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Viewer */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-60 bg-black flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition z-10"
          >
            <X size={24} />
          </button>

          {/* Previous Button */}
          {urls.length > 1 && (
            <button
              onClick={goToPrev}
              className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition z-10"
            >
              <ChevronLeft size={32} />
            </button>
          )}

          {/* Image */}
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img
              src={urls[lightboxIndex]}
              alt={`${title} - Photo ${lightboxIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            {/* Image Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
              {lightboxIndex + 1} / {urls.length}
            </div>
          </div>

          {/* Next Button */}
          {urls.length > 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition z-10"
            >
              <ChevronRight size={32} />
            </button>
          )}
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        listingTitle={title || "Listing"}
        listingUrl={window.location.href}
        listingImage={urls[0]}
      />
    </div>
  );
};

export default PhotoGalleryModal;
