import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// get all wishlist collections
export const fetchWishlistCollections = createAsyncThunk(
  "wishlist/fetchCollections",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch("/api/wishlist/collections", {
        credentials: "include",
        headers: {
          ...(auth.token && { Authorization: `Bearer ${auth.token}` }),
        },
      });

      // If unauthorized, return empty array (user not logged in)
      if (response.status === 401) {
        return [];
      }

      const data = await response.json();
      return { listingId, ...data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//  Create a new collection with a listing
export const createCollectionWithListing = createAsyncThunk(
  "wishlist/createCollection",
  async ({ name, listingId }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch("/api/wishlist/collections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(auth.token && { Authorization: `Bearer ${auth.token}` }),
        },
        credentials: "include",
        body: JSON.stringify({ name, listingId }),
      });

      if (!response.ok) throw new Error("Failed to create collection");

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//  Add to existing collection
export const addToExistingCollection = createAsyncThunk(
  "wishlist/addToCollection",
  async ({ collectionId, listingId }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch(
        `/api/wishlist/collections/${collectionId}/listings/${listingId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            ...(auth.token && { Authorization: `Bearer ${auth.token}` }),
          },
        }
      );

      if (!response.ok) throw new Error("Failed to add to collection");

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//  Delete a collection
export const deleteCollection = createAsyncThunk(
  "wishlist/deleteCollection",
  async (collectionId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch(
        `/api/wishlist/collections/${collectionId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            ...(auth.token && { Authorization: `Bearer ${auth.token}` }),
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete collection");

      return collectionId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//  Fetch a single collection with details
export const fetchSingleCollection = createAsyncThunk(
  "wishlist/fetchSingleCollection",
  async (collectionId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch(
        `/api/wishlist/collections/${collectionId}`,
        {
          credentials: "include",
          headers: {
            ...(auth.token && { Authorization: `Bearer ${auth.token}` }),
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch collection");

      const data = await response.json();
      return data.collection;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//  Remove listing from collection
export const removeFromCollection = createAsyncThunk(
  "wishlist/removeFromCollection",
  async ({ collectionId, listingId }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch(
        `/api/wishlist/collections/${collectionId}/listings/${listingId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            ...(auth.token && { Authorization: `Bearer ${auth.token}` }),
          },
        }
      );

      if (!response.ok) throw new Error("Failed to remove listing");

      return { collectionId, listingId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
//  The Slice
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    collections: [], // All collections
    currentCollection: null, // The currently opened collection
    savedListings: {},
    status: "idle", // loading, succeeded, failed
    error: null,

    // For the popup
    showCreateDialog: false, // Whether to open the popup or not
    currentListingId: null, // The listing to add
    availableCollections: [], // Available collections to choose from
  },
  reducers: {
    // Open the popup
    openCreateDialog: (state, action) => {
      state.showCreateDialog = true;
      state.currentListingId = action.payload.listingId;
      state.availableCollections = action.payload.collections || [];
    },

    // Close the popup
    closeCreateDialog: (state) => {
      state.showCreateDialog = false;
      state.currentListingId = null;
      state.availableCollections = [];
    },

    // Clear the error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //  Fetch all collections
      .addCase(fetchWishlistCollections.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWishlistCollections.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.collections = action.payload;

        // Update savedListings (for coloring hearts)
        state.savedListings = {};
        action.payload.forEach((collection) => {
          collection.listings.forEach((listing) => {
            const listingId = listing._id || listing;
            if (!state.savedListings[listingId]) {
              state.savedListings[listingId] = {
                isSaved: true,
                collections: [],
              };
            }
            state.savedListings[listingId].collections.push({
              _id: collection._id,
              name: collection.name,
            });
          });
        });
      })
      .addCase(fetchWishlistCollections.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      //  Toggle Listing
      .addCase(toggleListing.fulfilled, (state, action) => {
        const { listingId, action: actionType, collections } = action.payload;

        if (actionType === "needCollection") {
          // Open popup with available collections
          state.showCreateDialog = true;
          state.currentListingId = listingId;
          state.availableCollections = collections || [];
        } else if (actionType === "removed") {
          // The listing was removed → update savedListings
          state.savedListings[listingId] = {
            isSaved: false,
            collections: [],
          };

          // Remove the listing from all collections in the state
          state.collections.forEach((collection) => {
            collection.listings = collection.listings.filter((id) => {
              const idString = typeof id === "string" ? id : id._id;
              return idString !== listingId;
            });
          });
        }
      })

      //  Create a new collection
      .addCase(createCollectionWithListing.fulfilled, (state, action) => {
        const { collection } = action.payload;

        // Add the new collection to collections
        state.collections.push(collection);

        // Close the popup
        state.showCreateDialog = false;

        // Update savedListings
        const listingId = collection.listings[0];
        state.savedListings[listingId] = {
          isSaved: true,
          collections: [{ _id: collection._id, name: collection.name }],
        };
      })

      //  Add to existing collection
      .addCase(addToExistingCollection.fulfilled, (state, action) => {
        const { collection } = action.payload;

        // Update the collection in the state
        const index = state.collections.findIndex(
          (c) => c._id === collection._id
        );
        if (index !== -1) {
          state.collections[index] = collection;
        }

        // Close the popup
        state.showCreateDialog = false;

        // Update savedListings
        collection.listings.forEach((listing) => {
          const listingId = listing._id || listing;
          if (!state.savedListings[listingId]) {
            state.savedListings[listingId] = {
              isSaved: true,
              collections: [],
            };
          }

          // Make sure the collection is not already present
          const exists = state.savedListings[listingId].collections.some(
            (c) => c._id === collection._id
          );
          if (!exists) {
            state.savedListings[listingId].collections.push({
              _id: collection._id,
              name: collection.name,
            });
          }
        });
      })

      //  Delete a collection
      .addCase(deleteCollection.fulfilled, (state, action) => {
        const collectionId = action.payload;

        // Remove the collection from collections
        state.collections = state.collections.filter(
          (c) => c._id !== collectionId
        );

        // Update savedListings
        Object.keys(state.savedListings).forEach((listingId) => {
          // Remove the collection from collections
          state.savedListings[listingId].collections = state.savedListings[
            listingId
          ].collections.filter((c) => c._id !== collectionId);

          // If there are no other collections, the listing is not saved
          if (state.savedListings[listingId].collections.length === 0) {
            state.savedListings[listingId].isSaved = false;
          }
        });
      })

      //  Fetch a single collection
      .addCase(fetchSingleCollection.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSingleCollection.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentCollection = action.payload; // Current collection
      })
      .addCase(fetchSingleCollection.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      }) // Remove from collection
      .addCase(removeFromCollection.fulfilled, (state, action) => {
        const { listingId } = action.payload;
        // Update savedListings
        if (state.savedListings[listingId]) {
          state.savedListings[listingId].isSaved = false;
          state.savedListings[listingId].collections = [];
        }
      });
  },
});

export const { openCreateDialog, closeCreateDialog, clearError } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;
