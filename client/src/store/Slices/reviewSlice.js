import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "/api/review";

// ============= Async thunk actions for reviews =================
// ------------- 1. Get all reviews for a listing --------------
export const getReviewsByListing = createAsyncThunk(
  "review/getReviewsByListing",
  async (listingId) => {
    const response = await axios.get(`/api/listings/${listingId}/reviews`);
    return response.data;
  }
);

// ------------- 2. Create a new review --------------
export const createReview = createAsyncThunk(
  "review/createReview",
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, reviewData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// ------------- 3. Delete a review --------------
export const deleteReview = createAsyncThunk(
  "review/deleteReview",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// ============= Review slice =================
const reviewSlice = createSlice({
  name: "review",
  initialState: {
    reviews: [],
    statistics: {
      totalReviews: 0,
      avgRating: 0,
    },
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    clearReviews: (state) => {
      state.reviews = [];
      state.statistics = {
        totalReviews: 0,
        avgRating: 0,
      };
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get reviews by listing
      .addCase(getReviewsByListing.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getReviewsByListing.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reviews = action.payload.reviews || [];
        state.statistics = action.payload.statistics || {
          totalReviews: 0,
          avgRating: 0,
        };
      })
      .addCase(getReviewsByListing.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Create review
      .addCase(createReview.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reviews.push(action.payload);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.error || action.error.message;
      })
      // Delete review
      .addCase(deleteReview.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reviews = state.reviews.filter(
          (review) => review._id !== action.payload
        );
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.error || action.error.message;
      });
  },
});

export const { clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
