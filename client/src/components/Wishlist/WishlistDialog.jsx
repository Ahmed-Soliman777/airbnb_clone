import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createCollectionWithListing,
  addToExistingCollection,
  closeCreateDialog,
  fetchWishlistCollections,
} from "@/store/Slices/wishlistSlice";

export default function WishlistDialog() {
  const dispatch = useDispatch();

  const { showCreateDialog, currentListingId, availableCollections } =
    useSelector((state) => state.wishlist);

  const [collectionName, setCollectionName] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const handleCreate = async () => {
    if (collectionName.trim() && currentListingId) {
      await dispatch(
        createCollectionWithListing({
          name: collectionName,
          listingId: currentListingId,
        })
      );
      dispatch(fetchWishlistCollections());
      setCollectionName("");
      setCharCount(0);
      setShowNewForm(false);
    }
  };

  const handleSelectExisting = async (collectionId) => {
    await dispatch(
      addToExistingCollection({
        collectionId,
        listingId: currentListingId,
      })
    );
    dispatch(fetchWishlistCollections());
  };

  const handleClose = () => {
    dispatch(closeCreateDialog());
    setCollectionName("");
    setCharCount(0);
    setShowNewForm(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= 50) {
      setCollectionName(value);
      setCharCount(value.length);
    }
  };

  const hasExistingCollections =
    availableCollections && availableCollections.length > 0;

  return (
    <Dialog open={showCreateDialog} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[650px] p-0 gap-0 max-h-[90vh] flex flex-col">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-semibold">
              {showNewForm ? "Create wishlist" : "Save to wishlist"}
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Content - with scroll */}
        <div className="px-6 py-6 overflow-y-auto flex-1">
          {/* ========== Create Form ========== */}
          {(!hasExistingCollections || showNewForm) && (
            <div className="space-y-4">
              {showNewForm && hasExistingCollections && (
                <button
                  onClick={() => setShowNewForm(false)}
                  className="text-sm text-gray-700 hover:text-gray-900 mb-2 flex items-center gap-1"
                >
                  <span>←</span> Back
                </button>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-900"
                >
                  Name
                </label>
                <Input
                  id="name"
                  value={collectionName}
                  onChange={handleInputChange}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleCreate();
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  autoFocus
                  maxLength={50}
                />
                <p className="text-xs text-gray-500">
                  {charCount}/50 characters
                </p>
              </div>
            </div>
          )}

          {/* ========== Collections Grid ========== */}
          {hasExistingCollections && !showNewForm && (
            <div className="space-y-6">
              {/* Grid of collections - with max height for scroll */}
              <div className="grid grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-2">
                {availableCollections.map((collection) => {
                  const listingsCount = collection.listings?.length || 0;
                  const coverImage =
                    collection.listings?.[0]?.images?.[0]?.url ||
                    collection.listings?.[0]?.images?.[0] ||
                    "https://placehold.co/400x300?text=No+Image";

                  return (
                    <button
                      key={collection._id}
                      onClick={() => handleSelectExisting(collection._id)}
                      className="group relative bg-transparent cursor-pointer text-left"
                    >
                      {/* Image */}
                      <div className="relative aspect-4/3 overflow-hidden mb-2">
                        <img
                          src={coverImage}
                          alt={collection.name}
                          className="w-full h-full object-cover rounded-2xl "
                        />
                      </div>

                      {/* Collection info */}
                      <div className="py-1">
                        <h3 className="text-base font-semibold text-gray-900 mb-0.5 truncate">
                          {collection.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {listingsCount} saved
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Create new button */}
              <Button
                onClick={() => setShowNewForm(true)}
                className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-6 rounded-lg transition-colors"
              >
                Create new wishlist
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        {(!hasExistingCollections || showNewForm) && (
          <div className="px-6 py-4 border-t flex justify-between items-center shrink-0">
            <button
              onClick={handleClose}
              className="text-sm font-semibold text-gray-900 hover:text-gray-700 underline"
            >
              Cancel
            </button>

            <Button
              onClick={handleCreate}
              disabled={!collectionName.trim()}
              className="bg-gray-900 hover:bg-black text-white font-semibold px-6 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Create
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
