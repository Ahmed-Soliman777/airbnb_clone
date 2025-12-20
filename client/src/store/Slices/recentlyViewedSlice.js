import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/api";

// Fetch recently viewed listings (for logged-in users)
export const fetchRecentlyViewed = createAsyncThunk(
  "recentlyViewed/fetchRecentlyViewed",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching recently viewed from API...");
      const response = await axios.get(`${API_URL}/recently-viewed`, {
        withCredentials: true,
      });
      console.log("Recently viewed response:", response.data);
      return response.data.recentlyViewed || [];
    } catch (error) {
      console.error("Error fetching recently viewed:", error);
      // If unauthorized, return empty array (user not logged in)
      if (error.response?.status === 401) {
        return [];
      }
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Add listing to recently viewed (for logged-in users)
export const addRecentlyViewed = createAsyncThunk(
  "recentlyViewed/addRecentlyViewed",
  async (listingId, { rejectWithValue }) => {
    try {
      console.log("Adding to recently viewed:", listingId);
      await axios.post(
        `${API_URL}/recently-viewed/${listingId}`,
        {},
        {
          withCredentials: true,
        }
      );
      console.log("Successfully added to recently viewed");
      return listingId;
    } catch (error) {
      console.error("Error adding to recently viewed:", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Clear recently viewed history (for logged-in users)
export const clearRecentlyViewed = createAsyncThunk(
  "recentlyViewed/clearRecentlyViewed",
  async (_, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/recently-viewed`, {
        withCredentials: true,
      });
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const recentlyViewedSlice = createSlice({
  name: "recentlyViewed",
  initialState: {
    items: [], // Array of listing objects
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    clearRecentlyViewedState: (state) => {
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch recently viewed
      .addCase(fetchRecentlyViewed.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRecentlyViewed.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchRecentlyViewed.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Add recently viewed
      .addCase(addRecentlyViewed.fulfilled, () => {
        // Will refetch to get updated list
      })
      .addCase(addRecentlyViewed.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Clear recently viewed
      .addCase(clearRecentlyViewed.fulfilled, (state) => {
        state.items = [];
      })
      .addCase(clearRecentlyViewed.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearRecentlyViewedState } =
  recentlyViewedSlice.actions;

export default recentlyViewedSlice.reducer;
