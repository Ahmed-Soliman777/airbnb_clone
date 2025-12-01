import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Files, Mail, MessageSquare, Share2 } from "lucide-react";
import { useState } from "react";

const ShareModal = ({
  isOpen,
  onClose,
  listingTitle,
  listingUrl,
  listingImage,
  listingDescription,
}) => {
  const [copiedURL, setCopiedURL] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(listingUrl);
    setCopiedURL(true);
    setTimeout(() => setCopiedURL(false), 2000);
  };

  const shareOptions = [
    {
      name: "Copy Link",
      icon: <Files size={24} />,
      action: handleCopyLink,
    },
    {
      name: "Email",
      icon: <Mail size={24} />,
      action: () => {
        window.location.href = `mailto:?subject=Check out this listing: ${listingTitle}&body=${listingUrl}`;
      },
    },
    {
      name: "Messages",
      icon: <MessageSquare size={24} />,
      action: () => {
        window.location.href = `sms:?body=Check out this listing: ${listingTitle} ${listingUrl}`;
      },
    },
    {
      name: "WhatsApp",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      ),
      action: () => {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(
            `Check out this listing: ${listingTitle} ${listingUrl}`
          )}`,
          "_blank"
        );
      },
    },
    {
      name: "Messenger",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.627 0 12-4.974 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z" />
        </svg>
      ),
      action: () => {
        window.open(
          `fb-messenger://share/?link=${encodeURIComponent(listingUrl)}`,
          "_blank"
        );
      },
    },
    {
      name: "Facebook",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            listingUrl
          )}`,
          "_blank"
        );
      },
    },
    {
      name: "Twitter",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            `Check out this listing: ${listingTitle}`
          )}&url=${encodeURIComponent(listingUrl)}`,
          "_blank"
        );
      },
    },
    {
      name: "Embed",
      icon: <Share2 size={24} />,
      action: () => {
        const embedCode = `<iframe src="${listingUrl}" width="600" height="400" frameborder="0"></iframe>`;
        navigator.clipboard.writeText(embedCode);
        alert("Embed code copied to clipboard!");
      },
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl rounded-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Share this place
          </DialogTitle>
        </DialogHeader>

        {/* Listing Preview Card */}
        <div className="overflow-hidden">
          <div className="flex gap-3  justify-around items-center ">
            {listingImage && (
              <div className="w-16 h-16 flex shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={listingImage}
                  alt={listingTitle}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                {listingTitle}
              </h3>
              {listingDescription && (
                <p className="text-xs text-gray-600 line-clamp-3">
                  {listingDescription}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Share Options Grid */}
        <div className="grid grid-cols-2 gap-1 py-4">
          {shareOptions.map((option) => (
            <button
              key={option.name}
              onClick={option.action}
              className="flex items-center gap-3 p-1 rounded-lg border hover:bg-gray-100 transition-colors"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full">
                {option.icon}
              </div>
              <span className="text-black font-semibold text-center">
                {option.name}
              </span>
            </button>
          ))}

          {/* copied link notification */}
          <div
            className={`col-span-2 mt-2 text-center text-sm font-medium ${
              copiedURL ? "opacity-100" : "opacity-0"
            } transition-opacity`}
          >
            {copiedURL ? (
              <div className="flex items-center justify-center gap-2">
                <Check fill="green" size={16} />
                Link copied to clipboard!
              </div>
            ) : (
              <div>&nbsp;</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
