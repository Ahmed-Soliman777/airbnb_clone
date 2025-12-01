import { X } from "lucide-react";

const PhotoGalleryModal = ({ isOpen, onClose, images = [], title }) => {
  if (!isOpen) return null;

  const urls = images
    .map((img) => (typeof img === "string" ? img : img?.url))
    .filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-900 hover:text-gray-600 transition"
          >
            <X size={24} />
            <span className="text-sm font-medium">Close</span>
          </button>
          <div className="text-gray-700 text-sm font-medium">
            {title} - {urls.length} {urls.length === 1 ? "photo" : "photos"}
          </div>
        </div>
      </div>

      {/* Grid View */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-[200px]">
          {urls.map((url, index) => {
            const patterns = [
              "md:col-span-2 md:row-span-1", // 2-1
              "md:col-span-1 md:row-span-1", // 1-1
              "md:col-span-1 md:row-span-2", // 1-2
            ];
            const pattern = patterns[index % patterns.length];

            return (
              <div
                key={index}
                className={`${pattern} overflow-hidden rounded-lg bg-gray-100 hover:shadow-lg transition`}
              >
                <img
                  src={url}
                  alt={`${title} - Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            );
          })}
        </div>
        {urls.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No images available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoGalleryModal;
