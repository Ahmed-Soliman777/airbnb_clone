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

      if (response.status === 401) {
        return [];
      }

      const data = await response.json();
      return data.collections || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//  Toggle listing in wishlist
export const toggleListing = createAsyncThunk(
  "wishlist/toggleListing",
  async (listingId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`/api/wishlist/toggle/${listingId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(auth.token && { Authorization: `Bearer ${auth.token}` }),
        },
      });

      if (!response.ok) {
        const err = await response
          .json()
          .catch(() => ({ message: response.statusText }));
        return rejectWithValue(err.message || "Failed to toggle listing");
      }

      const data = await response.json();
      return { listingId, ...data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create a new collection with a listing
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

// Add to existing collection
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

// Delete a collection
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

// Fetch a single collection with details
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

// Remove listing from collection
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

// The Slice
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    collections: [],
    currentCollection: null,
    savedListings: {},
    status: "idle",
    collectionStatus: "idle",
    error: null,
    showCreateDialog: false,
    currentListingId: null,
    availableCollections: [],
  },
  reducers: {
    openCreateDialog: (state, action) => {
      state.showCreateDialog = true;
      state.currentListingId = action.payload.listingId;
      state.availableCollections = action.payload.collections || [];
    },
    closeCreateDialog: (state) => {
      state.showCreateDialog = false;
      state.currentListingId = null;
      state.availableCollections = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all collections
      .addCase(fetchWishlistCollections.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWishlistCollections.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.collections = action.payload;
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

      // ⭐ Toggle Listing - بدون تغيير status
      .addCase(toggleListing.fulfilled, (state, action) => {
        const { listingId, action: actionType, collections } = action.payload;
        if (actionType === "needCollection") {
          state.showCreateDialog = true;
          state.currentListingId = listingId;
          state.availableCollections = collections || [];
        } else if (actionType === "removed") {
          state.savedListings[listingId] = {
            isSaved: false,
            collections: [],
          };
          state.collections.forEach((collection) => {
            collection.listings = collection.listings.filter((id) => {
              const idString = typeof id === "string" ? id : id._id;
              return idString !== listingId;
            });
          });
          state.showCreateDialog = false;
        }
      })
      .addCase(toggleListing.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Create collection
      .addCase(createCollectionWithListing.fulfilled, (state, action) => {
        const { collection } = action.payload;
        state.collections.push(collection);
        state.showCreateDialog = false;
        const listingId = collection.listings[0];
        state.savedListings[listingId] = {
          isSaved: true,
          collections: [{ _id: collection._id, name: collection.name }],
        };
      })

      // Add to existing collection
      .addCase(addToExistingCollection.fulfilled, (state, action) => {
        const { collection } = action.payload;
        const index = state.collections.findIndex(
          (c) => c._id === collection._id
        );
        if (index !== -1) {
          state.collections[index] = collection;
        }
        state.showCreateDialog = false;
        collection.listings.forEach((listing) => {
          const listingId = listing._id || listing;
          if (!state.savedListings[listingId]) {
            state.savedListings[listingId] = {
              isSaved: true,
              collections: [],
            };
          }
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

      // Delete collection
      .addCase(deleteCollection.fulfilled, (state, action) => {
        const collectionId = action.payload;
        state.collections = state.collections.filter(
          (c) => c._id !== collectionId
        );
        Object.keys(state.savedListings).forEach((listingId) => {
          state.savedListings[listingId].collections = state.savedListings[
            listingId
          ].collections.filter((c) => c._id !== collectionId);
          if (state.savedListings[listingId].collections.length === 0) {
            state.savedListings[listingId].isSaved = false;
          }
        });
      })

      //  Fetch single collection - use collectionStatus
      .addCase(fetchSingleCollection.pending, (state) => {
        state.collectionStatus = "loading";
      })
      .addCase(fetchSingleCollection.fulfilled, (state, action) => {
        state.collectionStatus = "succeeded";
        state.currentCollection = action.payload;
      })
      .addCase(fetchSingleCollection.rejected, (state, action) => {
        state.collectionStatus = "failed";
        state.error = action.payload;
      })

      // Remove from collection
      .addCase(removeFromCollection.fulfilled, (state, action) => {
        const { listingId } = action.payload;
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
