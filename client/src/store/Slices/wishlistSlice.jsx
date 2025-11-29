import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch wishlist
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/wishlist", {
        credentials: "include",
      });
      const data = await response.json();
      return data.wishlist || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Toggle wishlist item
export const toggleWishlistItem = createAsyncThunk(
  "wishlist/toggleWishlistItem",
  async (listingId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/wishlist/${listingId}`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to toggle wishlist");
      return listingId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [], // Array of listing IDs
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.map((item) => item._id);
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Toggle wishlist
      .addCase(toggleWishlistItem.fulfilled, (state, action) => {
        const listingId = action.payload;
        const index = state.items.indexOf(listingId);
        if (index > -1) {
          state.items.splice(index, 1);
        } else {
          state.items.push(listingId);
        }
      });
  },
});

export default wishlistSlice.reducer;
