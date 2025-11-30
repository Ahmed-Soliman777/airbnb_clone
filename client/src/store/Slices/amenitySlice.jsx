import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch amenities
export const fetchAmenities = createAsyncThunk(
  "amenity/fetchAmenities",
  async () => {
    const response = await axios.get("/api/amenity");
    // console.log(response.data);
    return response.data;
  }
);

const amenitySlice = createSlice({
  name: "amenitySlice",
  initialState: {
    amenities: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAmenities.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAmenities.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.amenities = action.payload.data;
      })
      .addCase(fetchAmenities.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default amenitySlice.reducer;
