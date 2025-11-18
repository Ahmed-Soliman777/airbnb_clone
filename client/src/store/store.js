import { configureStore } from "@reduxjs/toolkit";
import listingReducer from "./Slices/listingSlice";
import amenityReducer from "./Slices/amenitySlice";
import authReducer from "./Slices/authslice";
import languageReducer from './Slices/languageSlice';

const store = configureStore({
  reducer: {
    listing: listingReducer,
    amenity: amenityReducer,
    auth: authReducer,
    lang: languageReducer,
  },
});

export default store;
