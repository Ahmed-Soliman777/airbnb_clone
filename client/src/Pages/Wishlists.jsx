import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { X } from "lucide-react";
import {
  fetchWishlistCollections,
  deleteCollection,
} from "@/store/Slices/wishlistSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Wishlists() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { collections, status } = useSelector((state) => state.wishlist);
  const { token } = useSelector((state) => state.auth);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState(null);

  useEffect(() => {
    if (token) {
      dispatch(fetchWishlistCollections());
    } else {
      navigate("/login");
    }
  }, [dispatch, token, navigate]);

  // open confirmation dialog
  const handleDeleteClick = (e, collection) => {
    e.stopPropagation();
    setCollectionToDelete(collection);
    setShowDeleteDialog(true);
  };

  // confirm delete
  const confirmDelete = async () => {
    if (collectionToDelete) {
      await dispatch(deleteCollection(collectionToDelete._id));
      setShowDeleteDialog(false);
      setCollectionToDelete(null);
    }
  };

  // cancel delete
  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setCollectionToDelete(null);
  };

  const handleCardClick = (collectionId) => {
    navigate(`/wishlists/${collectionId}`);
  };

  // if loading
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading wishlists...</div>
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            No wishlists yet
          </h2>
          <p className="text-gray-600 mb-8">
            Start saving your favorite places by clicking the heart icon on any
            listing
          </p>
          <Button onClick={() => navigate("/")}>Explore listings</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Wishlists</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {collections.map((collection) => {
            // number of listings in the collection
            const listingsCount = collection.listings?.length || 0;
            // cover image for the collection
            const coverImage =
              collection.listings?.[0]?.images?.[0]?.url ||
              collection.listings?.[0]?.images?.[0] ||
              "https://placehold.co/400x300?text=No+Image";

            return (
              <div
                key={collection._id}
                onClick={() => handleCardClick(collection._id)}
                className="group relative bg-transparent  cursor-pointer"
              >
                <div className="relative aspect-4/3 overflow-hidden">
                  <img
                    src={coverImage}
                    alt={collection.name}
                    className="w-full h-full object-cover rounded-3xl"
                  />

                  {/* Delete button */}
                  <button
                    onClick={(e) => handleDeleteClick(e, collection)}
                    className="absolute top-3 left-3 bg-white/90 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md cursor-pointer"
                    aria-label="Delete collection"
                  >
                    <X size={18} className="text-gray-700" />
                  </button>
                </div>

                {/* list info */}
                <div className="py-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                    {collection.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {listingsCount} {listingsCount === 1 ? "saved" : "saved"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delete Confirmation Dialog*/}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md p-0 gap-0">
          <div className="px-6 py-6">
            <DialogHeader className="space-y-3 text-center">
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Delete this wishlist?
              </DialogTitle>
              <DialogDescription className="text-base text-gray-600">
                <span className="font-semibold">
                  "{collectionToDelete?.name}"
                </span>{" "}
                will be permanently deleted.
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Footer with buttons */}
          <div className="px-6 pb-6 flex gap-3 justify-end">
            <Button
              onClick={cancelDelete}
              variant="ghost"
              className="text-sm font-semibold text-gray-900 hover:text-gray-700 hover:bg-gray-100 px-6 py-2"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              className="bg-gray-900 hover:bg-black text-white text-sm font-semibold px-6 py-2"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
