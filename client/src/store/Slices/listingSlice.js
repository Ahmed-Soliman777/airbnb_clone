import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ============= Async thunk actions for listings =================
// ------------- 1. Get all listings --------------
export const GetAllListings = createAsyncThunk(
  "listing/allListings",
  async () => {
    const response = await axios.get("/api/listings");
    return response.data;
  }
);

//------------- 2. Get a single listing by ID --------------
export const GetListingById = createAsyncThunk(
  "listing/listingById",
  async (id) => {
    const response = await axios.get(`/api/listings/${id}`);
    return response.data;
  }
);

// ------------- 3. Create a new listing --------------
export const createListing = createAsyncThunk(
  "listing/createListing",
  async (newListing) => {
    const response = await axios.post("/api/listings", newListing);
    return response.data;
  }
);

// ------------- 4. Update an existing listing --------------
export const updateListing = createAsyncThunk(
  "listing/updateListing",
  async (updatedListing) => {
    const response = await axios.put(
      `/api/listings/${updatedListing.id}`,
      updatedListing
    );
    return response.data;
  }
);

// ------------- 5. Delete a listing --------------
export const deleteListing = createAsyncThunk(
  "listing/deleteListing",
  async (id) => {
    const response = await axios.delete(`/api/listings/${id}`);
    return response.data;
  }
);

//============ Listing Slice =================
const listingSlice = createSlice({
  name: "listingSlice",
  initialState: {
    listings: [],
    listing: null,
    status: "idle",
    error: null,
  },
  //extraReducers for async thunks
  extraReducers: (builder) => {
    builder
      // ------------- 1. Get all listings --------------
      .addCase(GetAllListings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(GetAllListings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.listings = action.payload;
      })
      .addCase(GetAllListings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // ------------- 2. Get a single listing by ID --------------
      .addCase(GetListingById.fulfilled, (state, action) => {
        state.listing = action.payload;
      })

      // ------------- 3. Create a new listing --------------
      .addCase(createListing.fulfilled, (state, action) => {
        state.listings.push(action.payload);
      })

      // ------------- 4. Update an existing listing --------------
      .addCase(updateListing.fulfilled, (state, action) => {
        const i = state.listings.findIndex((l) => l.id === action.payload.id);
        if (i !== -1) state.listings[i] = action.payload;
      })

      // ------------- 5. Delete a listing --------------
      .addCase(deleteListing.fulfilled, (state, action) => {
        state.listings = state.listings.filter((l) => l.id !== action.payload);
      });
  },
});

export default listingSlice.reducer;
