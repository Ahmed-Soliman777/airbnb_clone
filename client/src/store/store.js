import { configureStore } from "@reduxjs/toolkit";
import listingReducer from "./Slices/listingSlice";
import amenityReducer from "./Slices/amenitySlice";
import authReducer from "./Slices/authslice";

const store = configureStore({
  reducer: {
    listing: listingReducer,
    amenity: amenityReducer,
    auth: authReducer,
  },
});

export default store;
