import { configureStore } from "@reduxjs/toolkit";
import listingReducer from "./Slices/listingSlice";
import amenityReducer from "./Slices/amenitySlice";

const store = configureStore({
  reducer: {
    listing: listingReducer,
    amenity: amenityReducer,
  },
});

export default store;
