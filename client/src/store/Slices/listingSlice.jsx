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
    const formData = new FormData();

    // add text fields...
    formData.append("title", newListing.title);
    formData.append("description", newListing.description);
    formData.append("propertyType", newListing.propertyType);
    formData.append("pricePerNight", newListing.pricePerNight);
    formData.append("maxGuests", newListing.maxGuests);
    formData.append("cleaningFee", newListing.cleaningFee || 0);
    formData.append("bedrooms", newListing.bedrooms || 1);
    formData.append("bathrooms", newListing.bathrooms || 1);

    // Location fields
    formData.append("street", newListing.street || "");
    formData.append("city", newListing.city || "");
    formData.append("country", newListing.country || "");
    formData.append(
      "coordinates",
      JSON.stringify(newListing.coordinates || { lat: 0, lng: 0 })
    );

    // Amenities
    formData.append("amenities", JSON.stringify(newListing.amenities || []));

    // Availability
    formData.append(
      "availability",
      JSON.stringify(newListing.availability || [])
    );

    // Images - MUST be File objects!
    newListing.images.forEach((file) => {
      console.log("FILE BEING SENT:", file);
      formData.append("images", file);
    });

    const response = await axios.post("/api/listings", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

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

// ------------- 6. Search listings --------------
export const searchListings = createAsyncThunk(
  "listing/searchListings",
  async (searchParams) => {
    const queryString = new URLSearchParams(searchParams).toString();
    const response = await axios.get(`/api/listings/search?${queryString}`);
    return response.data;
  }
);

//============ Listing Slice =================
const listingSlice = createSlice({
  name: "listingSlice",
  initialState: {
    listings: [],
    listing: null,
    searchResults: [],
    searchMetadata: null,
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
      .addCase(GetListingById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(GetListingById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.listing = action.payload;
      })
      .addCase(GetListingById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
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
      })

      // ------------- 6. Search listings --------------
      .addCase(searchListings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchListings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.searchResults = action.payload.items;
        state.searchMetadata = action.payload.search_metadata;
      })
      .addCase(searchListings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default listingSlice.reducer;
